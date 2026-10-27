'use client';

import React from 'react';
import NextLink from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ArrowDown,
  Layers,
  GraduationCap,
  RotateCw,
  Network,
  Eye,
  User,
  Compass,
  Play,
  CheckCircle2,
  Lock,
  Flame,
  Zap,
  BookOpen,
} from 'lucide-react';

export default function FlowDiagramPage() {
  return (
    <div className="min-h-screen bg-[#F5F3EC] text-[#111218] p-6 lg:p-10 font-sans selection:bg-[#B8FF3D] selection:text-[#111218]">
      {/* HEADER BANNER */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#FFFDF7] border-2 border-[#111218] rounded-3xl shadow-neo">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B8FF3D] border border-[#111218] rounded-full text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 fill-[#111218]" />
              <span>Saras AI Platform • Application Architecture</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black font-display uppercase tracking-tight text-[#111218]">
              Screen Flow & Navigation Blueprint
            </h1>
            <p className="text-xs sm:text-sm font-medium text-[#636573]">
              Visual breakdown of how learners navigate between Discovery, Interactive Study, Recall Loops, and Mastery Tracking.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 bg-[#F5F3EC] border border-[#111218] rounded-xl text-xs font-mono font-bold">
              11 Core Screens • Connected Loop
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            VISUAL FLOW DIAGRAM CANVAS
        ───────────────────────────────────────────────────────────── */}
        <div className="p-8 bg-[#FFFDF7] border-2 border-[#111218] rounded-3xl shadow-neo-lg space-y-10">
          
          {/* LEVEL 1: ENTRY & ONBOARDING */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#111218] text-white flex items-center justify-center text-xs font-black font-mono">
                1
              </span>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#111218] font-display">
                Entry & Authentication Tier
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {/* Landing Page */}
              <div className="p-5 rounded-2xl bg-[#F5F3EC] border-2 border-[#111218] shadow-neo-sm space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 bg-[#FFFDF7] rounded border border-[#111218]">
                    / OR /landing
                  </span>
                  <Compass className="w-4 h-4 text-[#111218]" />
                </div>
                <div>
                  <h3 className="text-base font-black font-display text-[#111218]">Landing Page</h3>
                  <p className="text-xs text-[#636573] mt-1">
                    System Architecture overview, feature showcases, pipeline simulation, and direct entry points.
                  </p>
                </div>
                <div className="pt-2 border-t border-[#111218]/15 flex items-center justify-between text-[11px] font-bold text-[#111218]">
                  <span>CTA: &ldquo;Start Learning&rdquo;</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#111218]" />
                </div>
              </div>

              {/* Connector Arrow */}
              <div className="flex flex-col justify-center items-center text-center p-2">
                <div className="px-3 py-1 bg-[#B8FF3D] border border-[#111218] rounded-lg text-[10px] font-mono font-bold uppercase shadow-sm">
                  User Choice / Session Check
                </div>
                <div className="text-xs font-bold text-[#111218] mt-1">
                  ⇄ Quick Demo or Guest Jump
                </div>
              </div>

              {/* Auth Page */}
              <div className="p-5 rounded-2xl bg-[#FFFDF7] border-2 border-[#111218] shadow-neo-sm space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 bg-[#B8FF3D] rounded border border-[#111218]">
                    /auth (signin / signup)
                  </span>
                  <Lock className="w-4 h-4 text-[#111218]" />
                </div>
                <div>
                  <h3 className="text-base font-black font-display text-[#111218]">Authentication Hub</h3>
                  <p className="text-xs text-[#636573] mt-1">
                    1-Click Demo Logins (Kunal, Alex, Maya, Guest) + local storage registration with custom tracks & avatars.
                  </p>
                </div>
                <div className="pt-2 border-t border-[#111218]/15 flex items-center justify-between text-[11px] font-bold text-[#111218]">
                  <span>Redirects on Auth →</span>
                  <span className="font-mono text-[10px] bg-[#111218] text-white px-1.5 py-0.5 rounded">/discover</span>
                </div>
              </div>
            </div>
          </div>

          {/* TRANSITION ARROW */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-[#FFFDF7] border-2 border-[#111218] rounded-full shadow-neo-sm text-xs font-black font-display uppercase tracking-wider">
              <span>Enters Logged-In Workspace</span>
              <ArrowDown className="w-4 h-4 text-[#111218]" />
            </div>
          </div>

          {/* LEVEL 2: CENTRAL DISCOVER HUB */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#B8FF3D] text-[#111218] border border-[#111218] flex items-center justify-center text-xs font-black font-mono">
                2
              </span>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#111218] font-display">
                Central Learning Hub & Ingestion Engine
              </h2>
            </div>

            <div className="p-6 rounded-3xl bg-[#B8FF3D]/20 border-2 border-[#111218] shadow-neo space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-[#111218]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#B8FF3D] border border-[#111218] flex items-center justify-center font-bold">
                    <Compass className="w-4 h-4 text-[#111218]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black font-display text-[#111218]">Discover Dashboard (/discover)</h3>
                    <p className="text-xs text-[#636573]">Central catalog, YouTube URL ingestion input, lesson status, and quick-resume cards</p>
                  </div>
                </div>
                <span className="badge-black px-2.5 py-1 text-[10px] font-mono">PRIMARY DASHBOARD</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                <div className="p-3 bg-[#FFFDF7] border border-[#111218] rounded-xl space-y-1">
                  <div className="font-bold font-display text-[#111218]">1. Paste Video URL</div>
                  <div className="text-[11px] text-[#636573]">Calls Ingestion Agent to parse transcripts & create checkpoints</div>
                </div>
                <div className="p-3 bg-[#FFFDF7] border border-[#111218] rounded-xl space-y-1">
                  <div className="font-bold font-display text-[#111218]">2. Pick Pre-Ingested Lesson</div>
                  <div className="text-[11px] text-[#636573]">Neural Networks, Computer Science, Networking, PC Hardware</div>
                </div>
                <div className="p-3 bg-[#FFFDF7] border border-[#111218] rounded-xl space-y-1">
                  <div className="font-bold font-display text-[#111218]">3. Launch Studio</div>
                  <div className="text-[11px] text-[#636573]">Directly opens video study session at <code className="font-mono">/video/:id</code></div>
                </div>
              </div>
            </div>
          </div>

          {/* TRANSITION ARROW */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-[#FFFDF7] border-2 border-[#111218] rounded-full shadow-neo-sm text-xs font-black font-display uppercase tracking-wider">
              <span>Launches Interactive Lesson</span>
              <ArrowDown className="w-4 h-4 text-[#111218]" />
            </div>
          </div>

          {/* LEVEL 3: ACTIVE VIDEO LEARNING STUDIO */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#E9DFFF] text-[#111218] border border-[#111218] flex items-center justify-center text-xs font-black font-mono">
                3
              </span>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#111218] font-display">
                Core Interactive Workspace
              </h2>
            </div>

            <div className="p-6 rounded-3xl bg-[#E9DFFF]/30 border-2 border-[#111218] shadow-neo space-y-4">
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#111218]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#E9DFFF] border border-[#111218] flex items-center justify-center font-bold">
                    <Play className="w-4 h-4 text-[#111218]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black font-display text-[#111218]">Video Learning Studio (/video/[id])</h3>
                    <p className="text-xs text-[#636573]">Segment-by-segment active learning environment with AI verification</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#111218] text-white px-2 py-0.5 rounded">
                  STUDY CORE
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#FFFDF7] border border-[#111218] rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-[#636573] uppercase">Component A</span>
                  <p className="font-extrabold text-[#111218]">Timestamped Video</p>
                  <p className="text-[11px] text-[#636573]">Gated progress per segment</p>
                </div>

                <div className="p-3 bg-[#FFFDF7] border border-[#111218] rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-[#636573] uppercase">Component B</span>
                  <p className="font-extrabold text-[#111218]">Smart Notes</p>
                  <p className="text-[11px] text-[#636573]">Auto-synthesized definitions</p>
                </div>

                <div className="p-3 bg-[#FFFDF7] border border-[#111218] rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-[#636573] uppercase">Component C</span>
                  <p className="font-extrabold text-[#111218]">Checkpoint Quiz</p>
                  <p className="text-[11px] text-[#636573]">Diagnostic question gating</p>
                </div>

                <div className="p-3 bg-[#FFFDF7] border border-[#111218] rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-[#636573] uppercase">Component D</span>
                  <p className="font-extrabold text-[#111218]">Focus Guardian</p>
                  <p className="text-[11px] text-[#636573]">On-device gaze tracking</p>
                </div>
              </div>
            </div>
          </div>

          {/* LEVEL 4: THE 3 SATELLITE RECALL LOOPS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#DCEEFF] text-[#111218] border border-[#111218] flex items-center justify-center text-xs font-black font-mono">
                  4
                </span>
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#111218] font-display">
                  Active Recall & Knowledge Reinforcement (Sidebar Hub)
                </h2>
              </div>
              <span className="text-[11px] font-bold text-[#636573]">Parallel Learning Modes</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Flashcards */}
              <div className="p-5 rounded-2xl bg-[#FFFDF7] border-2 border-[#111218] shadow-neo-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 bg-[#B8FF3D] rounded border border-[#111218]">
                    /flashcards
                  </span>
                  <Layers className="w-4 h-4 text-[#111218]" />
                </div>
                <h3 className="text-base font-black font-display text-[#111218]">Flashcards Studio</h3>
                <p className="text-xs text-[#636573]">
                  Interactive 3D card flipping with SuperMemo-2 spaced repetition grading (Again, Hard, Good, Easy).
                </p>
                <div className="pt-2 border-t border-[#111218]/15 text-[10px] font-bold text-[#111218] flex items-center gap-1">
                  <span>Input: Video Flashcards DB</span>
                </div>
              </div>

              {/* Revision */}
              <div className="p-5 rounded-2xl bg-[#FFFDF7] border-2 border-[#111218] shadow-neo-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 bg-[#E9DFFF] rounded border border-[#111218]">
                    /revision
                  </span>
                  <RotateCw className="w-4 h-4 text-[#111218]" />
                </div>
                <h3 className="text-base font-black font-display text-[#111218]">AI Revision Engine</h3>
                <p className="text-xs text-[#636573]">
                  Targeted drills concentrating on concepts where previous quiz accuracy was lowest (&lt;70%).
                </p>
                <div className="pt-2 border-t border-[#111218]/15 text-[10px] font-bold text-[#111218] flex items-center gap-1">
                  <span>Input: User Quiz History</span>
                </div>
              </div>

              {/* Knowledge Map */}
              <div className="p-5 rounded-2xl bg-[#FFFDF7] border-2 border-[#111218] shadow-neo-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 bg-[#DCEEFF] rounded border border-[#111218]">
                    /knowledge
                  </span>
                  <Network className="w-4 h-4 text-[#111218]" />
                </div>
                <h3 className="text-base font-black font-display text-[#111218]">Knowledge Map</h3>
                <p className="text-xs text-[#636573]">
                  Interactive Directed Acyclic Graph (DAG) visualizing prerequisite relationships and cross-lesson links.
                </p>
                <div className="pt-2 border-t border-[#111218]/15 text-[10px] font-bold text-[#111218] flex items-center gap-1">
                  <span>Input: Semantic Concept Links</span>
                </div>
              </div>
            </div>
          </div>

          {/* LEVEL 5: PERFORMANCE, EXAM & PROFILE MASTERY */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#FFD1C7] text-[#111218] border border-[#111218] flex items-center justify-center text-xs font-black font-mono">
                5
              </span>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#111218] font-display">
                Mastery, Testing & Progress Analytics
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Deep Focus */}
              <div className="p-5 rounded-2xl bg-[#FFFDF7] border-2 border-[#111218] shadow-neo-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 bg-[#FFFDF7] rounded border border-[#111218]">
                    /focus
                  </span>
                  <Eye className="w-4 h-4 text-[#111218]" />
                </div>
                <h3 className="text-base font-black font-display text-[#111218]">Deep Focus Mode</h3>
                <p className="text-xs text-[#636573]">
                  Distraction-free Pomodoro session with live camera attention analytics and distraction logging.
                </p>
              </div>

              {/* Exam Mode */}
              <div className="p-5 rounded-2xl bg-[#FFFDF7] border-2 border-[#111218] shadow-neo-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 bg-[#B8FF3D] rounded border border-[#111218]">
                    /exam
                  </span>
                  <GraduationCap className="w-4 h-4 text-[#111218]" />
                </div>
                <h3 className="text-base font-black font-display text-[#111218]">Exam Simulation</h3>
                <p className="text-xs text-[#636573]">
                  Calculates holistic Readiness Score (0-100%) against target exam dates and milestones.
                </p>
              </div>

              {/* Profile */}
              <div className="p-5 rounded-2xl bg-[#FFFDF7] border-2 border-[#111218] shadow-neo-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 bg-[#FFD1C7] rounded border border-[#111218]">
                    /profile
                  </span>
                  <User className="w-4 h-4 text-[#111218]" />
                </div>
                <h3 className="text-base font-black font-display text-[#111218]">Student Profile</h3>
                <p className="text-xs text-[#636573]">
                  Tracks daily study streak, lessons completed, weekly activity timeline, goals, and sign-out.
                </p>
              </div>
            </div>
          </div>

          {/* SYSTEM SUMMARY FOOTER */}
          <div className="p-4 bg-[#F5F3EC] border-2 border-[#111218] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#B8FF3D] border border-[#111218]" />
              <span className="font-bold text-[#111218]">Unified Session & Navigation State:</span>
              <span className="text-[#636573]">Persists across all screens via React Context & LocalStorage</span>
            </div>
            <div className="font-mono font-bold text-[#111218]">
              Saras AI Architecture v1.0
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
