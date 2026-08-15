import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chatAssistantReply } from '@/lib/services/ai';
import { ingestVideo } from '@/lib/services/ingestion';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'default_user';

    const messages = await db.chatMessage.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'asc' },
      take: 100,
    });

    const parsed = messages.map((m) => ({
      ...m,
      suggested_video_ids: m.suggested_video_ids
        ? JSON.parse(m.suggested_video_ids)
        : null,
    }));

    return NextResponse.json({ messages: parsed });
  } catch (error: any) {
    console.error('[API /api/chat GET Error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch chat messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message,
      userId = 'default_user',
      action, // optional: 'ingest_suggested'
      videoUrl,
    } = body;

    // Action: Add video directly from chat assistant
    if (action === 'ingest_suggested' && videoUrl) {
      const ingestRes = await ingestVideo(videoUrl, { source: 'chat', userId });

      // Record assistant action confirmation in chat
      const confirmationMsg = await db.chatMessage.create({
        data: {
          user_id: userId,
          role: 'assistant',
          content: `✅ Added **${ingestRes.video.title}** to your library! It's split into ${(ingestRes.video as any).segments?.length || 3} topic checkpoints ready for learning.`,
          suggested_video_ids: JSON.stringify([
            {
              id: ingestRes.video.id,
              title: ingestRes.video.title,
              channel: ingestRes.video.channel,
              thumbnail_url: ingestRes.video.thumbnail_url,
              status: ingestRes.video.status,
            },
          ]),
        },
      });

      return NextResponse.json({
        success: true,
        video: ingestRes.video,
        message: {
          ...confirmationMsg,
          suggested_video_ids: JSON.parse(confirmationMsg.suggested_video_ids || '[]'),
        },
      });
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }

    // Save user's message
    await db.chatMessage.create({
      data: {
        user_id: userId,
        role: 'user',
        content: message,
      },
    });

    // Fetch prior history
    const history = await db.chatMessage.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'asc' },
      take: 10,
    });

    // Run AI chat recommendation
    const aiResponse = await chatAssistantReply(
      message,
      history.map((h) => ({ role: h.role, content: h.content }))
    );

    // Save assistant response
    const assistantMsg = await db.chatMessage.create({
      data: {
        user_id: userId,
        role: 'assistant',
        content: aiResponse.reply,
        suggested_video_ids: aiResponse.suggestedVideos
          ? JSON.stringify(aiResponse.suggestedVideos)
          : null,
      },
    });

    return NextResponse.json({
      reply: {
        ...assistantMsg,
        suggested_video_ids: aiResponse.suggestedVideos || null,
      },
    });
  } catch (error: any) {
    console.error('[API /api/chat POST Error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to process chat message' }, { status: 500 });
  }
}
