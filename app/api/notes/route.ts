import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateSmartNotesForVideo } from '@/lib/services/ai';
import { fetchTranscript } from '@/lib/services/transcript';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get('videoId');
    const forceRefresh = searchParams.get('refresh') === 'true';

    if (!videoId) {
      return NextResponse.json({ error: 'videoId is required' }, { status: 400 });
    }

    const video = await db.video.findFirst({
      where: {
        OR: [{ id: videoId }, { youtube_video_id: videoId }],
      },
      include: {
        segments: {
          orderBy: { order_index: 'asc' },
        },
        notes: {
          orderBy: { order_index: 'asc' },
          include: {
            segment: {
              select: {
                id: true,
                order_index: true,
                title: true,
                start_seconds: true,
                end_seconds: true,
              },
            },
          },
        },
      },
    });

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Detect legacy low-quality fallback notes that need automatic upgrade
    const isLegacyFallback =
      video.notes.length > 0 &&
      (video.notes.length <= 8 &&
        video.notes.some(
          (n) =>
            n.content.includes('structured walkthrough of') ||
            n.content.startsWith('Welcomes the viewer') ||
            n.content.includes('decomposing the material into') ||
            n.content.startsWith('Describes the two categories')
        ));

    // If valid high-yield notes already exist and no upgrade/refresh is needed, return cached notes
    if (video.notes.length > 0 && !isLegacyFallback && !forceRefresh) {
      return NextResponse.json({ notes: video.notes });
    }

    // On-demand generation or automatic upgrade path
    console.log(`[NOTES] Generating Master Smart Notes for video "${video.title}"...`);

    let transcriptItems: any[] = [];
    try {
      const tData = await fetchTranscript(video.youtube_video_id);
      transcriptItems = tData.items || [];
    } catch (e: any) {
      console.warn(`[NOTES] Transcript fetch non-fatal error (${video.youtube_video_id}):`, e.message);
    }

    const generatedNotes = await generateSmartNotesForVideo(
      video.title,
      video.channel,
      video.segments,
      transcriptItems
    );

    // Atomic wipe of legacy/prior notes and save new rich notes
    await db.smartNote.deleteMany({
      where: { video_id: video.id },
    });

    const savedNotes: any[] = [];
    for (let i = 0; i < generatedNotes.length; i++) {
      const n = generatedNotes[i];
      const matchedSeg =
        n.segment_order_index != null && video.segments[n.segment_order_index]
          ? video.segments[n.segment_order_index]
          : null;

      const created = await db.smartNote.create({
        data: {
          video_id: video.id,
          segment_id: matchedSeg ? matchedSeg.id : null,
          section_type: n.section_type,
          title: n.title,
          content: n.content,
          source_start_seconds: n.source_start_seconds ?? null,
          source_end_seconds: n.source_end_seconds ?? null,
          order_index: i,
        },
        include: {
          segment: {
            select: {
              id: true,
              order_index: true,
              title: true,
              start_seconds: true,
              end_seconds: true,
            },
          },
        },
      });
      savedNotes.push(created);
    }

    console.log(`[NOTES] Successfully saved ${savedNotes.length} Master Smart Notes for "${video.title}".`);
    return NextResponse.json({ notes: savedNotes });
  } catch (error: any) {
    console.error('[API /api/notes GET Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch smart notes' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { videoId } = body;

    if (!videoId) {
      return NextResponse.json({ error: 'videoId is required' }, { status: 400 });
    }

    const video = await db.video.findFirst({
      where: {
        OR: [{ id: videoId }, { youtube_video_id: videoId }],
      },
      include: {
        segments: {
          orderBy: { order_index: 'asc' },
        },
      },
    });

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Force regenerate with full transcript grounding
    let transcriptItems: any[] = [];
    try {
      const tData = await fetchTranscript(video.youtube_video_id);
      transcriptItems = tData.items || [];
    } catch (e: any) {
      console.warn(`[NOTES] Transcript fetch non-fatal error (${video.youtube_video_id}):`, e.message);
    }

    console.log(`[NOTES] Force regenerating Master Smart Notes for "${video.title}"...`);
    const generatedNotes = await generateSmartNotesForVideo(
      video.title,
      video.channel,
      video.segments,
      transcriptItems
    );

    // Delete prior notes
    await db.smartNote.deleteMany({
      where: { video_id: video.id },
    });

    const savedNotes: any[] = [];
    for (let i = 0; i < generatedNotes.length; i++) {
      const n = generatedNotes[i];
      const matchedSeg =
        n.segment_order_index != null && video.segments[n.segment_order_index]
          ? video.segments[n.segment_order_index]
          : null;

      const created = await db.smartNote.create({
        data: {
          video_id: video.id,
          segment_id: matchedSeg ? matchedSeg.id : null,
          section_type: n.section_type,
          title: n.title,
          content: n.content,
          source_start_seconds: n.source_start_seconds ?? null,
          source_end_seconds: n.source_end_seconds ?? null,
          order_index: i,
        },
        include: {
          segment: {
            select: {
              id: true,
              order_index: true,
              title: true,
              start_seconds: true,
              end_seconds: true,
            },
          },
        },
      });
      savedNotes.push(created);
    }

    return NextResponse.json({ notes: savedNotes });
  } catch (error: any) {
    console.error('[API /api/notes POST Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to regenerate smart notes' },
      { status: 500 }
    );
  }
}
