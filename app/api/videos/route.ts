import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAllVertexGdnaVideos } from '@/lib/data/vertexGdnaCourse';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'default_user';

    let videos: any[] = [];
    try {
      videos = await db.video.findMany({
        orderBy: { created_at: 'desc' },
        include: {
          segments: {
            orderBy: { order_index: 'asc' },
            select: {
              id: true,
              order_index: true,
              title: true,
              start_seconds: true,
              end_seconds: true,
            },
          },
          flashcards: {
            select: { id: true, mastered: true },
          },
          progress: {
            where: { user_id: userId },
          },
        },
      });
    } catch (dbErr: any) {
      console.warn('[API /api/videos] Database query error (serverless fallback active):', dbErr?.message);
    }

    // Seamless fallback for serverless deployments: ensure all Vertex GDNA course videos are present
    const existingYtIds = new Set(videos.map((v) => v.youtube_video_id));
    const allCourseVideos = getAllVertexGdnaVideos();
    const missingCourseVideos = allCourseVideos
      .filter((cv) => !existingYtIds.has(cv.youtube_video_id))
      .map((cv) => ({
        id: cv.id,
        youtube_video_id: cv.youtube_video_id,
        title: cv.title,
        channel: cv.channel,
        duration_seconds: cv.duration_seconds,
        thumbnail_url: cv.thumbnail_url,
        status: 'ready',
        segments: cv.segments.map((s) => ({
          id: s.id,
          order_index: s.order_index,
          title: s.title,
          start_seconds: s.start_seconds,
          end_seconds: s.end_seconds,
        })),
        flashcards: [],
        progress: [],
      }));

    return NextResponse.json({ videos: [...videos, ...missingCourseVideos] });
  } catch (error: any) {
    console.error('[API /api/videos GET Error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch videos' }, { status: 500 });
  }
}
