import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getVertexGdnaVideo } from '@/lib/data/vertexGdnaCourse';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'default_user';
    const videoId = params.id;

    // 1. Fast-path: Check pre-ingested Vertex GDNA course video catalog first
    // This guarantees 100% availability on serverless platforms (e.g. Vercel) with zero latency
    const courseVideo = getVertexGdnaVideo(videoId);
    if (courseVideo) {
      return NextResponse.json({
        video: {
          id: courseVideo.id,
          youtube_video_id: courseVideo.youtube_video_id,
          title: courseVideo.title,
          channel: courseVideo.channel,
          duration_seconds: courseVideo.duration_seconds,
          thumbnail_url: courseVideo.thumbnail_url,
          status: 'ready',
          segments: courseVideo.segments,
          flashcards: [],
          notes: [],
          userProgress: {
            current_segment_index: 0,
            completed_segment_ids: '[]',
          },
        },
      });
    }

    // 2. Query database with safe error boundary (in case of ephemeral serverless filesystem)
    let video: any = null;
    try {
      video = await db.video.findFirst({
        where: {
          OR: [{ id: videoId }, { youtube_video_id: videoId }],
        },
        include: {
          segments: {
            orderBy: { order_index: 'asc' },
            include: {
              quiz_questions: true,
            },
          },
          flashcards: {
            orderBy: { created_at: 'asc' },
          },
          progress: {
            where: { user_id: userId },
          },
        },
      });
    } catch (dbErr: any) {
      console.warn('[API /api/videos/[id]] Database query warning:', dbErr?.message);
    }

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Parse options JSON strings in quiz_questions
    const formattedSegments = video.segments.map((seg: any) => ({
      ...seg,
      quiz_questions: seg.quiz_questions.map((q: any) => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
      })),
    }));

    return NextResponse.json({
      video: {
        ...video,
        segments: formattedSegments,
        userProgress: video.progress?.[0] || {
          current_segment_index: 0,
          completed_segment_ids: '[]',
        },
      },
    });
  } catch (error: any) {
    console.error('[API /api/videos/[id] GET Error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to get video' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = params.id;
    await db.video.delete({
      where: { id: videoId },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API /api/videos/[id] DELETE Error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete video' }, { status: 500 });
  }
}
