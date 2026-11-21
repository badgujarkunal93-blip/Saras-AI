import { db } from '../lib/db';
import { generateSmartNotesForVideo } from '../lib/services/ai';
import { fetchTranscript } from '../lib/services/transcript';

async function backfillSmartNotes() {
  console.log('=== Saras AI Master Smart Notes Upgrade & Backfill ===\n');

  const readyVideos = await db.video.findMany({
    where: { status: 'ready' },
    include: {
      segments: {
        orderBy: { order_index: 'asc' },
      },
      notes: true,
    },
  });

  console.log(`Found ${readyVideos.length} ready videos in database.`);

  let upgradedCount = 0;
  let skippedCount = 0;

  for (const video of readyVideos) {
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

    // If it already has rich notes (e.g. >= 9 non-fallback notes), skip unless it's legacy fallback
    if (video.notes.length >= 9 && !isLegacyFallback) {
      console.log(`[SKIP] "${video.title}" already has ${video.notes.length} comprehensive Smart Notes.`);
      skippedCount++;
      continue;
    }

    console.log(`\n[UPGRADING] Master Smart Notes for "${video.title}" (${video.segments.length} segments)...`);

    try {
      let transcriptItems: any[] = [];
      try {
        const tRes = await fetchTranscript(video.youtube_video_id);
        transcriptItems = tRes.items || [];
        console.log(`  └─ Loaded ${transcriptItems.length} transcript items for grounding.`);
      } catch (err: any) {
        console.warn(`  └─ Transcript fetch notice: ${err.message}`);
      }

      const generatedNotes = await generateSmartNotesForVideo(
        video.title,
        video.channel,
        video.segments,
        transcriptItems
      );

      // Clean old notes
      await db.smartNote.deleteMany({
        where: { video_id: video.id },
      });

      for (let i = 0; i < generatedNotes.length; i++) {
        const note = generatedNotes[i];
        const matchedSeg =
          note.segment_order_index != null && video.segments[note.segment_order_index]
            ? video.segments[note.segment_order_index]
            : null;

        await db.smartNote.create({
          data: {
            video_id: video.id,
            segment_id: matchedSeg ? matchedSeg.id : null,
            section_type: note.section_type,
            title: note.title,
            content: note.content,
            source_start_seconds: note.source_start_seconds ?? null,
            source_end_seconds: note.source_end_seconds ?? null,
            order_index: i,
          },
        });
      }

      console.log(`✓ Upgraded & Saved ${generatedNotes.length} Master Smart Notes for "${video.title}"`);
      upgradedCount++;
    } catch (err: any) {
      console.error(`❌ Failed to upgrade notes for "${video.title}":`, err.message);
    }
  }

  console.log(`\n=== Upgrade Operation Completed ===`);
  console.log(`• Upgraded / Backfilled: ${upgradedCount} videos`);
  console.log(`• Retained (Already High-Yield): ${skippedCount} videos`);
}

backfillSmartNotes()
  .catch((e) => {
    console.error('Fatal backfill error:', e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
