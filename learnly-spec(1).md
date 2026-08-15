# Learnly — Project Spec

## 1. What it is
A learning platform that turns any YouTube video into a segmented, quiz-gated lesson. Paste a link, the video gets split into topic-based chunks, each chunk has 2-3 checkpoint questions the user must answer to unlock the next segment. Includes a dashboard, flashcards, task list, and a chat assistant that recommends and adds videos.

## 2. Core features

### 2.1 Video ingestion pipeline
1. User pastes a YouTube URL (via top bar OR via chat assistant).
2. Extract `video_id` from the URL.
3. **Cache check (critical):** query `videos` table by `video_id` + `youtube_channel/video hash`. If it already exists and has `status = 'ready'`, skip straight to loading the existing segments/quizzes/flashcards — never re-run transcript extraction or regenerate questions for a video that's already been processed. Multiple users pasting the same link should hit the same cached record.
4. If not cached: fetch transcript (with timestamps) → send to LLM to segment into logical topic chunks (title + start/end timestamp per chunk) → for each chunk, generate 2-3 quiz questions → generate flashcards for the full video → persist everything → mark `status = 'ready'`.
5. If processing fails partway, store `status = 'failed'` with an error reason so it can be retried without re-querying the transcript API unnecessarily.

### 2.2 Segmented player + quiz gating
- Embed via YouTube IFrame API, `seekTo()` to jump between segments.
- Player pauses at each segment boundary → quiz modal appears → correct answers (or a "review and continue" fallback after repeated wrong attempts) unlocks the next segment.
- Progress (`current_segment`, `completed` flags per segment) persisted per user per video.

### 2.3 Dashboard
- Stat cards: videos completed, flashcards saved, day streak.
- "Continue watching" cards with progress bar + segment count.
- "Suggested next" — populated either by simple tag/topic similarity across watched videos, or by the chat assistant's suggestions.

### 2.4 Sidebar: Tasks
- Compact checklist, not a full page. Backed by a simple `tasks` table (`id`, `user_id`, `label`, `done`, `linked_video_id` nullable — e.g. "Finish transformers video" links back to that video).

### 2.5 Sidebar: Chat assistant
- Persistent mini chat panel pinned in the sidebar (expandable to full view).
- Scoped to two jobs:
  1. **Recommend videos** — user describes what they want to learn ("something on backpropagation"), assistant searches/suggests YouTube videos (via YouTube Data API search or an LLM-suggested query + search) and returns 2-3 candidates with title + channel.
  2. **Add a video directly** — if the user says "add the second one" or pastes a link in chat, the assistant calls the *same* ingestion pipeline as the top-bar "Add video" button (see 2.1). This must be one shared function/endpoint — do not fork the logic between "chat add" and "manual add".
- Chat history persisted per user (`chat_messages` table) so the panel isn't stateless across sessions.

### 2.6 Flashcards
- Generated once per video at ingestion time, stored, editable/deletable by user. Not regenerated on repeat views.

### 2.7 Strict mode (camera attention detection)
- Optional per-video (or global user-level default) toggle: "Strict mode".
- When on, the browser requests webcam access and runs face/gaze detection **entirely client-side** — no video frames are ever sent to the server, only a boolean "attentive / not attentive" signal derived locally. Use a lightweight in-browser model (e.g. MediaPipe Face Landmarker or face-api.js) rather than routing frames through the backend.
- Detection loop (every ~1-2s): if no face is detected, or the face is turned away / eyes closed for more than a short grace period (e.g. 4-5s), auto-pause the YouTube player and show an overlay ("Paused — you looked away. Resume when ready.").
- Resume only on an explicit user action (click "Resume" or face re-detected + user clicks), not automatically — avoids flicker-resume if someone just glances away briefly.
- Track a lightweight `attention_events` log per session (timestamp, video_id, segment_id, event type: `looked_away` / `resumed` / `no_face`) so the user can see their own focus stats on the dashboard (e.g. "3 look-aways during this video") — this is for the user's own insight, not for anyone else to monitor.
- Must degrade gracefully: if the user denies camera permission, strict mode simply can't be enabled (show a message), and the rest of the app works normally without it.
- Explicit, visible consent required before enabling — a clear toggle + short explanation, camera indicator always visible while active (browsers already show this, but reinforce in UI), and an easy one-click way to turn it off mid-video.

## 3. Data model (Postgres / Supabase)

```
videos
  id (pk)
  youtube_video_id (unique, indexed)  -- the dedupe key
  title
  channel
  duration_seconds
  status  -- 'processing' | 'ready' | 'failed'
  error_reason (nullable)
  created_at

segments
  id (pk)
  video_id (fk -> videos)
  order_index
  title
  start_seconds
  end_seconds

quiz_questions
  id (pk)
  segment_id (fk -> segments)
  question
  options (jsonb)   -- for MCQ
  correct_answer

flashcards
  id (pk)
  video_id (fk -> videos)
  front
  back

user_video_progress
  id (pk)
  user_id (fk -> users)
  video_id (fk -> videos)
  current_segment_index
  completed_segment_ids (jsonb array)
  last_watched_at

tasks
  id (pk)
  user_id (fk -> users)
  label
  done (bool)
  linked_video_id (fk -> videos, nullable)

attention_events
  id (pk)
  user_id (fk -> users)
  video_id (fk -> videos)
  segment_id (fk -> segments, nullable)
  event_type  -- 'looked_away' | 'resumed' | 'no_face'
  created_at

chat_messages
  id (pk)
  user_id (fk -> users)
  role  -- 'user' | 'assistant'
  content
  suggested_video_ids (jsonb, nullable)  -- videos the assistant suggested in this message
  created_at
```

Key point: **`videos`, `segments`, `quiz_questions`, and `flashcards` are global/shared**, keyed by `youtube_video_id` — not duplicated per user. Only `user_video_progress` is per-user. This is what makes the "don't reprocess a video that's already been done" requirement work even across different users.

## 4. Shared ingestion function

```
async function ingestVideo(youtubeUrl, { source: 'manual' | 'chat', userId }) {
  const videoId = extractYouTubeId(youtubeUrl)
  const existing = await db.videos.findByYoutubeId(videoId)
  if (existing?.status === 'ready') return existing   // cache hit, no reprocessing

  if (existing?.status === 'processing') return existing // avoid duplicate concurrent jobs

  const video = await db.videos.create({ youtube_video_id: videoId, status: 'processing' })
  // fire background job: fetchTranscript -> segmentWithLLM -> generateQuizzes -> generateFlashcards -> mark ready
  enqueueProcessingJob(video.id)
  return video
}
```

Both the top-bar "Add video" button and the chat assistant's "add this video" action call `ingestVideo()`. The chat assistant additionally logs the action into `chat_messages` and links the resulting `video.id` so the UI can show a "added ✓" confirmation in the thread.

## 5. Tech stack
- Frontend: Next.js + Tailwind + shadcn/ui
- Backend: Next.js API routes (or a small Node worker for the async ingestion job)
- DB: Supabase (Postgres + auth)
- LLM: Claude API — segmentation, quiz generation, flashcard generation, chat assistant
- Video: YouTube IFrame Player API
- Attention detection: MediaPipe Face Landmarker (runs in-browser via WebAssembly, no server round-trip)
- Job queue for ingestion: can start with a simple `status` column + polling; move to a real queue (e.g. BullMQ/Redis) if processing volume grows

## 6. Build order
1. `ingestVideo()` pipeline end-to-end for a single video (transcript → segments → quiz), no caching yet, no UI polish.
2. Add the cache check (`youtube_video_id` dedupe) — verify pasting the same link twice doesn't reprocess.
3. Player + quiz gating UI.
4. Dashboard with real data (stats, continue watching).
5. Sidebar tasks (basic CRUD).
6. Flashcards.
7. Chat assistant — start with recommend-only, then wire up the add-video action to call the shared `ingestVideo()`.
8. Strict mode — client-side face detection, auto-pause/resume overlay, `attention_events` logging. Build last since it's isolated from the core pipeline and easiest to bolt on once the player is stable.
