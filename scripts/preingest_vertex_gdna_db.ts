import { PrismaClient } from '@prisma/client';
import { getAllVertexGdnaVideos } from '../lib/data/vertexGdnaCourse';

const prisma = new PrismaClient();

async function main() {
  console.log('[PREINGEST] Starting preingestion for Vertex GDNA Course into Prisma DB...');
  const videos = getAllVertexGdnaVideos();
  console.log(`[PREINGEST] Found ${videos.length} videos to process.`);

  for (const v of videos) {
    console.log(`\n--> Processing Video Chapter ${v.chapter_number}: "${v.title}" (${v.youtube_video_id})`);

    const existing = await prisma.video.findUnique({
      where: { youtube_video_id: v.youtube_video_id },
    });

    let videoId: string;

    if (existing) {
      console.log(`    Found existing video (id: ${existing.id}). Updating metadata & replacing segments...`);
      await prisma.video.update({
        where: { id: existing.id },
        data: {
          title: v.title,
          channel: v.channel,
          duration_seconds: v.duration_seconds,
          thumbnail_url: v.thumbnail_url,
          status: 'ready',
          error_reason: null,
        }
      });

      await prisma.quizQuestion.deleteMany({
        where: { segment: { video_id: existing.id } }
      });
      await prisma.segment.deleteMany({
        where: { video_id: existing.id }
      });
      videoId = existing.id;
    } else {
      console.log(`    Creating new video record for ${v.youtube_video_id}...`);
      const created = await prisma.video.create({
        data: {
          id: v.id,
          youtube_video_id: v.youtube_video_id,
          title: v.title,
          channel: v.channel,
          duration_seconds: v.duration_seconds,
          thumbnail_url: v.thumbnail_url,
          status: 'ready',
        }
      });
      videoId = created.id;
    }

    // Now insert the high-fidelity segments and checkpoint quiz questions
    for (const seg of v.segments) {
      await prisma.segment.create({
        data: {
          video_id: videoId,
          order_index: seg.order_index,
          title: seg.title,
          summary: seg.summary,
          start_seconds: seg.start_seconds,
          end_seconds: seg.end_seconds,
          quiz_questions: {
            create: seg.quiz_questions.map((q) => ({
              question: q.question,
              options: JSON.stringify(q.options),
              correct_answer: q.correct_answer,
              explanation: q.explanation,
            }))
          }
        }
      });
      console.log(`    + Created Segment [${seg.start_seconds}s - ${seg.end_seconds}s]: "${seg.title}" (${seg.quiz_questions.length} quiz questions)`);
    }

    // Ensure default user progress record
    await prisma.userVideoProgress.upsert({
      where: {
        user_id_video_id: {
          user_id: 'default_user',
          video_id: videoId
        }
      },
      update: {
        last_watched_at: new Date()
      },
      create: {
        user_id: 'default_user',
        video_id: videoId,
        current_segment_index: 0,
        completed_segment_ids: '[]',
        last_watched_at: new Date()
      }
    });
  }

  console.log('\n[PREINGEST] All 10 Vertex GDNA Course videos pre-ingested successfully into Prisma SQLite DB!');
}

main()
  .catch((e) => {
    console.error('[PREINGEST Error]:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
