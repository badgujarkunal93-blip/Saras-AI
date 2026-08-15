import { db } from '@/lib/db';
import { extractYouTubeId, getYouTubeThumbnail } from '@/lib/utils';
import { fetchTranscript, fetchYouTubeMetadata } from './transcript';
import { generateSegmentsAndQuizzes, generateTranscriptGroundedFlashcards, validateAndFilterFlashcards } from './ai';

export interface IngestOptions {
  source?: 'manual' | 'chat';
  userId?: string;
}

/**
 * Unified Shared Ingestion Pipeline
 * Used by both top-bar 'Add Video' button, dashboard search input, and Chat Assistant.
 * Deduplicates by youtube_video_id — cached ready videos are returned immediately without reprocessing.
 */
export async function ingestVideo(youtubeUrl: string, options: IngestOptions = {}) {
  const userId = options.userId || 'default_user';
  const videoId = extractYouTubeId(youtubeUrl);

  if (!videoId) {
    throw new Error('Invalid YouTube URL or Video ID provided. Please check the URL format.');
  }

  console.log(`[INGEST] video_id=${videoId} source=${options.source || 'manual'}`);

  // 1. Deduplication / Cache check (Critical - Part 12)
  const existingVideo = await db.video.findUnique({
    where: { youtube_video_id: videoId },
    include: {
      segments: {
        orderBy: { order_index: 'asc' },
        include: { quiz_questions: true },
      },
      flashcards: true,
    },
  });

  // Cache hit: already processed and stored in database
  if (existingVideo && existingVideo.status === 'ready') {
    console.log(`[CACHE] hit (loaded ${existingVideo.segments.length} segments, ${existingVideo.flashcards.length} flashcards from database for video_id=${videoId})`);
    console.log(`[INGEST] ready (video_id=${videoId} cache_hit=true)`);
    // Ensure user progress record exists
    await ensureUserProgress(existingVideo.id, userId);
    return {
      video: existingVideo,
      cached: true,
    };
  }

  // Concurrent lock: currently being processed
  if (existingVideo && existingVideo.status === 'processing') {
    console.log(`[CACHE] pending (video_id=${videoId} is currently processing)`);
    return {
      video: existingVideo,
      cached: true,
    };
  }

  console.log(`[CACHE] miss (starting fresh ingestion for video_id=${videoId})`);

  // 2. Create or Reset video record to 'processing'
  let video = existingVideo
    ? await db.video.update({
        where: { id: existingVideo.id },
        data: {
          status: 'processing',
          error_reason: null,
        },
      })
    : await db.video.create({
        data: {
          youtube_video_id: videoId,
          title: `Processing Video: ${videoId}...`,
          channel: 'YouTube Creator',
          duration_seconds: 0,
          thumbnail_url: getYouTubeThumbnail(videoId),
          status: 'processing',
        },
      });

  // 3. Process video pipeline
  try {
    // Step A: Fetch metadata (title, author) via oEmbed
    const meta = await fetchYouTubeMetadata(videoId);
    console.log(`[METADATA] fetched title="${meta.title}" channel="${meta.channel}"`);

    // Step B: Fetch transcript with timestamps
    const { items: transcriptItems, fullText, estimatedDuration } = await fetchTranscript(videoId);
    console.log(`[TRANSCRIPT] fetched ${transcriptItems.length} transcript items, estimatedDuration=${estimatedDuration}s`);

    const totalDuration = estimatedDuration > 0 ? estimatedDuration : 480;

    // Step C: Run AI Segmentation, Quizzes, and Transcript-Grounded Flashcards
    const aiResult = await generateSegmentsAndQuizzes(meta.title, transcriptItems, totalDuration);
    console.log(`[AI] generation completed with ${aiResult.segments.length} segments and ${aiResult.flashcards.length} grounded flashcards`);

    // Step D: Persist everything to database in atomic transaction
    const updatedVideo = await db.$transaction(async (tx) => {
      // Clear any prior partial segments/flashcards if retrying failed video
      await tx.quizQuestion.deleteMany({
        where: { segment: { video_id: video.id } },
      });
      await tx.segment.deleteMany({
        where: { video_id: video.id },
      });
      await tx.flashcard.deleteMany({
        where: { video_id: video.id },
      });

      // Update Video metadata & status
      const savedVideo = await tx.video.update({
        where: { id: video.id },
        data: {
          title: meta.title,
          channel: meta.channel,
          duration_seconds: totalDuration,
          thumbnail_url: meta.thumbnailUrl || getYouTubeThumbnail(videoId),
          status: 'ready',
          error_reason: null,
        },
      });

      let totalQuizzesPersisted = 0;

      // Insert Segments and Quizzes
      for (const seg of aiResult.segments) {
        const createdSeg = await tx.segment.create({
          data: {
            video_id: savedVideo.id,
            order_index: seg.order_index,
            title: seg.title,
            summary: seg.summary,
            start_seconds: seg.start_seconds,
            end_seconds: seg.end_seconds,
          },
        });

        // Insert Quiz Questions for this segment
        for (const q of seg.quiz_questions) {
          await tx.quizQuestion.create({
            data: {
              segment_id: createdSeg.id,
              question: q.question,
              options: JSON.stringify(q.options),
              correct_answer: q.correct_answer,
              explanation: q.explanation,
            },
          });
          totalQuizzesPersisted++;
        }
      }

      // Insert Video-Grounded Flashcards
      for (const fc of aiResult.flashcards) {
        await tx.flashcard.create({
          data: {
            video_id: savedVideo.id,
            front: fc.front,
            back: fc.back,
            mastered: false,
          },
        });
      }

      console.log(`[DB] persisted ${aiResult.segments.length} segments, ${totalQuizzesPersisted} quizzes, ${aiResult.flashcards.length} grounded flashcards`);

      // Initialize default user progress record
      await tx.userVideoProgress.upsert({
        where: {
          user_id_video_id: {
            user_id: userId,
            video_id: savedVideo.id,
          },
        },
        create: {
          user_id: userId,
          video_id: savedVideo.id,
          current_segment_index: 0,
          completed_segment_ids: JSON.stringify([]),
        },
        update: {},
      });

      return savedVideo;
    });

    console.log(`[INGEST] ready (video_id=${videoId} status=ready)`);

    // Return complete newly generated video
    const finalVideo = await db.video.findUnique({
      where: { id: updatedVideo.id },
      include: {
        segments: {
          orderBy: { order_index: 'asc' },
          include: { quiz_questions: true },
        },
        flashcards: true,
      },
    });

    return {
      video: finalVideo || updatedVideo,
      cached: false,
    };
  } catch (err: any) {
    console.error(`[INGEST] failed (video_id=${videoId}):`, err.message);

    await db.video.update({
      where: { id: video.id },
      data: {
        status: 'failed',
        error_reason: err.message || 'Unknown processing error',
      },
    });

    throw err;
  }
}

/**
 * Explicitly regenerates flashcards from the transcript for a video (Rule 17)
 */
export async function regenerateVideoFlashcards(videoId: string) {
  const video = await db.video.findUnique({
    where: { id: videoId },
    include: { segments: true },
  });

  if (!video) throw new Error('Video not found');

  const { items: transcriptItems } = await fetchTranscript(video.youtube_video_id);
  const rawCards = generateTranscriptGroundedFlashcards(
    video.title,
    transcriptItems,
    video.segments as any
  );
  const validatedCards = validateAndFilterFlashcards(rawCards, video.title);

  await db.$transaction(async (tx) => {
    await tx.flashcard.deleteMany({
      where: { video_id: video.id },
    });

    for (const fc of validatedCards) {
      await tx.flashcard.create({
        data: {
          video_id: video.id,
          front: fc.front,
          back: fc.back,
          mastered: false,
        },
      });
    }
  });

  return await db.flashcard.findMany({ where: { video_id: video.id } });
}

/**
 * Helper to ensure a UserVideoProgress record exists
 */
async function ensureUserProgress(videoId: string, userId: string) {
  try {
    await db.userVideoProgress.upsert({
      where: {
        user_id_video_id: {
          user_id: userId,
          video_id: videoId,
        },
      },
      create: {
        user_id: userId,
        video_id: videoId,
        current_segment_index: 0,
        completed_segment_ids: JSON.stringify([]),
      },
      update: {
        last_watched_at: new Date(),
      },
    });
  } catch (e) {
    console.warn('[DB] User progress check error:', e);
  }
}
