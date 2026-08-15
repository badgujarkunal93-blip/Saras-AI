'use client';

import React, { useState, useEffect, useRef } from 'react';
import NextLink from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Play,
  Check,
  Cpu,
  Layers,
  Eye,
  ShieldCheck,
  Zap,
  RotateCw,
  Search,
  BookOpen,
  ArrowUpRight,
  Database,
  Code2,
  Terminal,
  Activity,
  ChevronDown,
  Lock,
  Flame,
  CheckCircle2,
  ListFilter,
  BarChart3,
  Lightbulb,
  Workflow,
  Share2,
  ExternalLink,
} from 'lucide-react';

export default function SarasLandingPage() {
  const [activePipelineNode, setActivePipelineNode] = useState<string | null>('segmentation');
  const [activeLoopStep, setActiveLoopStep] = useState<number>(0);
  const [simulationState, setSimulationState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [simStep, setSimStep] = useState<number>(0);
  const [simUrl, setSimUrl] = useState<string>('https://www.youtube.com/watch?v=kqtD5dpn9C8');

  // Loop through learning loop steps automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLoopStep((prev) => (prev + 1) % 6);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Run interactive pipeline simulator
  const handleRunSimulation = () => {
    if (simulationState === 'running') return;
    setSimulationState('running');
    setSimStep(1);

    setTimeout(() => setSimStep(2), 1200);
    setTimeout(() => setSimStep(3), 2400);
    setTimeout(() => setSimStep(4), 3600);
    setTimeout(() => {
      setSimStep(5);
      setSimulationState('completed');
    }, 4800);
  };

  const agentDetails: Record<
    string,
    { title: string; role: string; input: string; output: string; color: string; desc: string }
  > = {
    ingest: {
      title: 'Ingestion Agent',
      role: 'Source Processing',
      input: 'YouTube URL / Video Stream',
      output: 'Sanitized Transcript & Metadata',
      color: '#B8FF3D',
      desc: 'Extracts video ID, checks deterministic SQLite/Postgres cache, and pulls timestamped transcript tokens for downstream LLM processing.',
    },
    segmentation: {
      title: 'Segmentation Agent',
      role: 'Curriculum Structuring',
      input: 'Timestamped Transcript Stream',
      output: 'Topic-Bounded Learning Chapters',
      color: '#E9DFFF',
      desc: 'Applies pedagogical prompt heuristics via Groq Cloud (LLaMA 3.3) to identify semantic topic boundaries, grouping raw captions into standalone chapters.',
    },
    quiz: {
      title: 'Quiz Agent',
      role: 'Understanding Verification',
      input: 'Segment Transcript Slices',
      output: 'Grounded Checkpoint Quizzes',
      color: '#DCEEFF',
      desc: 'Synthesizes 4-option diagnostic multiple-choice questions grounded strictly in the current video segment, preventing seeking until verified.',
    },
    recall: {
      title: 'Recall Agent',
      role: 'Memory Retention Engine',
      input: 'Video Transcript & Core Definitions',
      output: 'Spaced Repetition Flashcards',
      color: '#DDF6BD',
      desc: 'Extracts essential conceptual definitions directly taught in the video and structures them into physical active recall study cards.',
    },
    focus: {
      title: 'Deep Focus Engine',
      role: 'Client-Side Attention Monitor',
      input: 'Local Camera Stream (In-Browser)',
      output: 'Playback State (Play / Auto-Pause)',
      color: '#111218',
      desc: 'Processes face landmarks completely on-device using MediaPipe & WebAssembly. Automatically pauses playback if cognitive drift or look-away exceeds 4 seconds.',
    },
  };

  return (
    <div className="min-h-screen bg-[#F5F3EC] text-[#111218] selection:bg-[#B8FF3D] selection:text-[#111218]">
      {/* ─────────────────────────────────────────────────────────────
          1. DEDICATED LANDING NAVBAR
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-[#F5F3EC]/90 backdrop-blur-md border-b-2 border-[#111218] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#B8FF3D] border-2 border-[#111218] shadow-neo-sm flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#111218] fill-[#111218]" />
            </div>
            <span className="font-display font-black text-lg tracking-tight text-[#111218] flex items-center">
              Saras
              <span className="text-[#111218] bg-[#B8FF3D] px-1.5 py-0.2 rounded ml-1 border border-[#111218] text-xs font-black">
                AI
              </span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold font-display uppercase tracking-wider text-[#111218]">
            <a href="#pipeline" className="hover:text-[#636573] transition-colors">
              How It Works
            </a>
            <a href="#architecture" className="hover:text-[#636573] transition-colors">
              AI Architecture
            </a>
            <a href="#tech-stack" className="hover:text-[#636573] transition-colors">
              Tech Stack
            </a>
            <a href="#privacy" className="hover:text-[#636573] transition-colors">
              Focus & Privacy
            </a>
            <a href="#status" className="hover:text-[#636573] transition-colors">
              Status
            </a>
          </nav>

          {/* App Entry CTA */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FFFDF7] border-2 border-[#111218] text-[10px] font-bold uppercase tracking-wider font-mono">
              <span className="w-2 h-2 rounded-full bg-[#B8FF3D] animate-pulse border border-[#111218]" />
              AI/ML Prototype
            </span>
            <NextLink
              href="/"
              className="neo-btn-primary px-4 py-2 text-xs font-bold font-display flex items-center gap-1.5"
            >
              <span>Open Saras AI</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B8FF3D]" />
            </NextLink>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Typography */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B8FF3D] border-2 border-[#111218] rounded-md shadow-neo-sm">
              <Workflow className="w-3.5 h-3.5 text-[#111218]" />
              <span className="text-xs font-black font-display uppercase tracking-wider text-[#111218]">
                Modular Multi-Agent Learning System
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#111218] font-display tracking-tight leading-[0.98] uppercase">
              Turn Any <br />
              <span className="bg-[#B8FF3D] px-3 py-0.5 rounded-xl border-2 border-[#111218] shadow-neo-sm inline-block my-1">
                Video
              </span>{' '}
              Into A <br />
              Learning System.
            </h1>

            <p className="text-base sm:text-lg text-[#636573] font-medium leading-relaxed max-w-xl">
              Saras AI transforms passive long-form educational videos into segmented lessons, checkpoint quizzes,
              grounded recall cards, and distraction-free deep focus.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <NextLink
                href="/"
                className="neo-btn-primary px-6 py-3.5 text-sm font-bold font-display flex items-center gap-2 shadow-neo hover:shadow-neo-lg"
              >
                <span>Start Learning Now</span>
                <ArrowRight className="w-4 h-4 text-[#B8FF3D]" />
              </NextLink>

              <a
                href="#architecture"
                className="neo-btn-outline px-5 py-3.5 text-sm font-bold font-display flex items-center gap-2 bg-[#FFFDF7]"
              >
                <span>Explore the AI Pipeline</span>
                <ChevronDown className="w-4 h-4 text-[#111218]" />
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t-2 border-[#111218]/15 max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-black font-display text-[#111218]">100%</div>
                <div className="text-[11px] font-bold text-[#636573] uppercase tracking-wider">Video Grounded</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black font-display text-[#111218]">Zero</div>
                <div className="text-[11px] font-bold text-[#636573] uppercase tracking-wider">Bypass Seeking</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black font-display text-[#111218]">Local</div>
                <div className="text-[11px] font-bold text-[#636573] uppercase tracking-wider">Private Attention</div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual: Interactive Computational Graph */}
          <div className="lg:col-span-5 relative">
            <div className="bg-[#FFFDF7] border-2 border-[#111218] rounded-3xl p-6 shadow-neo-lg space-y-4 relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#111218]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#B8FF3D] border border-[#111218]" />
                  <span className="text-xs font-black font-display uppercase tracking-wider text-[#111218]">
                    Pipeline Execution Graph
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#636573] font-bold">60 FPS · Reactive</span>
              </div>

              {/* Node Graph Visual */}
              <div className="space-y-3 relative py-2">
                {/* Node 1: Input Source */}
                <div
                  onMouseEnter={() => setActivePipelineNode('ingest')}
                  className={`p-3 rounded-xl border-2 border-[#111218] transition-all cursor-pointer ${
                    activePipelineNode === 'ingest'
                      ? 'bg-[#B8FF3D] shadow-neo-sm translate-x-1'
                      : 'bg-[#F5F3EC] hover:bg-[#FFFDF7]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold font-display">
                    <span className="flex items-center gap-2">
                      <Play className="w-3.5 h-3.5 text-[#111218]" />
                      01. YouTube Input Source
                    </span>
                    <span className="text-[10px] font-mono">Raw Transcript</span>
                  </div>
                </div>

                {/* Connecting Arrow */}
                <div className="flex justify-center -my-1">
                  <div className="w-0.5 h-4 bg-[#111218]" />
                </div>

                {/* Node 2: Segmentation Agent */}
                <div
                  onMouseEnter={() => setActivePipelineNode('segmentation')}
                  className={`p-3 rounded-xl border-2 border-[#111218] transition-all cursor-pointer ${
                    activePipelineNode === 'segmentation'
                      ? 'bg-[#E9DFFF] shadow-neo-sm translate-x-1'
                      : 'bg-[#F5F3EC] hover:bg-[#FFFDF7]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold font-display">
                    <span className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-[#111218]" />
                      02. Segmentation Agent
                    </span>
                    <span className="badge-black px-1.5 py-0.2 text-[9px]">LLaMA 3.3</span>
                  </div>
                </div>

                {/* Branching Connector */}
                <div className="flex justify-center -my-1">
                  <div className="w-0.5 h-4 bg-[#111218]" />
                </div>

                {/* Parallel Nodes 3 & 4: Quiz + Recall */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div
                    onMouseEnter={() => setActivePipelineNode('quiz')}
                    className={`p-3 rounded-xl border-2 border-[#111218] transition-all cursor-pointer ${
                      activePipelineNode === 'quiz'
                        ? 'bg-[#DCEEFF] shadow-neo-sm translate-x-0.5'
                        : 'bg-[#F5F3EC] hover:bg-[#FFFDF7]'
                    }`}
                  >
                    <div className="text-[11px] font-bold font-display flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3 text-[#111218]" />
                      03. Quiz Agent
                    </div>
                    <p className="text-[10px] text-[#636573] mt-1 font-medium">Checkpoint Gates</p>
                  </div>

                  <div
                    onMouseEnter={() => setActivePipelineNode('recall')}
                    className={`p-3 rounded-xl border-2 border-[#111218] transition-all cursor-pointer ${
                      activePipelineNode === 'recall'
                        ? 'bg-[#DDF6BD] shadow-neo-sm translate-x-0.5'
                        : 'bg-[#F5F3EC] hover:bg-[#FFFDF7]'
                    }`}
                  >
                    <div className="text-[11px] font-bold font-display flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#111218]" />
                      04. Recall Agent
                    </div>
                    <p className="text-[10px] text-[#636573] mt-1 font-medium">Spaced Cards</p>
                  </div>
                </div>

                {/* Connecting Arrow */}
                <div className="flex justify-center -my-1">
                  <div className="w-0.5 h-4 bg-[#111218]" />
                </div>

                {/* Node 5: Deep Focus Loop */}
                <div
                  onMouseEnter={() => setActivePipelineNode('focus')}
                  className={`p-3 rounded-xl border-2 border-[#111218] transition-all cursor-pointer ${
                    activePipelineNode === 'focus'
                      ? 'bg-[#111218] text-white shadow-neo-lime translate-x-1'
                      : 'bg-[#F5F3EC] hover:bg-[#FFFDF7]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold font-display">
                    <span className="flex items-center gap-2">
                      <Eye className={`w-3.5 h-3.5 ${activePipelineNode === 'focus' ? 'text-[#B8FF3D]' : 'text-[#111218]'}`} />
                      05. Deep Focus Engine
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold ${
                        activePipelineNode === 'focus' ? 'text-[#B8FF3D]' : 'text-[#111218]'
                      }`}
                    >
                      MediaPipe WASM
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Inspector Card */}
              {activePipelineNode && (
                <div className="p-3.5 bg-[#F5F3EC] border-2 border-[#111218] rounded-2xl space-y-1 text-xs transition-all">
                  <div className="flex items-center justify-between font-bold">
                    <span className="font-display uppercase text-[#111218]">
                      {agentDetails[activePipelineNode].title}
                    </span>
                    <span className="text-[10px] text-[#636573] font-mono">
                      {agentDetails[activePipelineNode].role}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#636573] leading-snug">
                    {agentDetails[activePipelineNode].desc}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. EDITORIAL STATEMENT: A VIDEO IS NOT A LESSON
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#111218] text-white py-20 border-y-2 border-[#111218] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-4">
            <span className="badge-lime px-3 py-1 text-xs font-extrabold uppercase font-display">
              Cognitive Science Principle
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display uppercase tracking-tight leading-[1.05]">
              A Video Is Not <br />
              <span className="text-[#B8FF3D]">A Lesson.</span>
            </h2>
            <p className="text-base text-slate-300 font-medium leading-relaxed">
              Passive video viewing creates the illusion of competence: 80% of information is lost within 48 hours without
              active retrieval. Saras AI converts passive streams into an active comprehension loop.
            </p>
          </div>

          {/* 5-Stage Active Retrieval Flow */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { step: '01', title: 'WATCH', desc: 'Engage with segmented concepts without forward seeking bypass.' },
              { step: '02', title: 'UNDERSTAND', desc: 'Digest structured chapters with clean semantic summaries.' },
              { step: '03', title: 'ANSWER', desc: 'Clear grounded checkpoint questions to unlock upcoming parts.' },
              { step: '04', title: 'RECALL', desc: 'Commit definitions to memory with physical flashcard ratings.' },
              { step: '05', title: 'MASTER', desc: 'Sustain distraction-free deep focus and track real progress.' },
            ].map((st, i) => (
              <div
                key={st.step}
                className="bg-[#21232C] border-2 border-white/10 hover:border-[#B8FF3D] rounded-2xl p-4 flex flex-col justify-between space-y-4 group transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#B8FF3D] font-bold">{st.step}</span>
                  <span className="w-2 h-2 rounded-full bg-[#B8FF3D] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold font-display text-white uppercase">{st.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug font-medium">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. HOW SARAS AI WORKS (Step-by-Step Architecture)
      ───────────────────────────────────────────────────────────── */}
      <section id="pipeline" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-2 border-[#111218]">
          <div className="space-y-2">
            <span className="badge-black px-2.5 py-0.5 text-xs font-bold uppercase font-display">
              Pipeline Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111218] font-display uppercase tracking-tight">
              How Saras AI Works
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#636573] font-medium max-w-md">
            Five specialized agents execute in sequence to convert raw video URLs into active learning environments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Step 1: Ingest */}
          <div className="bg-[#FFFDF7] border-2 border-[#111218] rounded-3xl p-6 shadow-neo flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="badge-lime px-2.5 py-0.5 text-[10px] font-black uppercase">Step 01</span>
                <span className="text-xs font-mono font-bold text-[#636573]">Video Ingestion</span>
              </div>
              <h3 className="text-lg font-extrabold text-[#111218] font-display uppercase">Ingest & Cache</h3>
              <p className="text-xs text-[#636573] leading-relaxed font-medium">
                Pulls full timestamped transcript subtitles via YouTube transcript parsers, checks local Prisma SQLite
                cache, and prepares tokens.
              </p>
            </div>
            <div className="p-3 bg-[#F5F3EC] rounded-xl border border-[#111218] text-[10px] font-mono text-[#111218] space-y-1">
              <div>Input: <span className="font-bold text-[#111218]">YouTube URL</span></div>
              <div>Output: <span className="font-bold text-[#111218]">Sanitized Transcripts</span></div>
            </div>
          </div>

          {/* Step 2: Understand */}
          <div className="bg-[#E9DFFF] border-2 border-[#111218] rounded-3xl p-6 shadow-neo flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="badge-black px-2.5 py-0.5 text-[10px] font-black uppercase">Step 02</span>
                <span className="text-xs font-mono font-bold text-[#21232C]">Segmentation Agent</span>
              </div>
              <h3 className="text-lg font-extrabold text-[#111218] font-display uppercase">Topic Segmentation</h3>
              <p className="text-xs text-[#21232C] leading-relaxed font-medium">
                Analyzes transcript narrative shifts to partition continuous 20–60 minute lectures into 3–6 focused
                concept chapters with exact second bounds.
              </p>
            </div>
            <div className="p-3 bg-[#FFFDF7] rounded-xl border border-[#111218] text-[10px] font-mono text-[#111218] space-y-1">
              <div>Agent: <span className="font-bold">LLaMA 3.3 via Groq</span></div>
              <div>Output: <span className="font-bold">Chapters with Timestamps</span></div>
            </div>
          </div>

          {/* Step 3: Verify */}
          <div className="bg-[#DCEEFF] border-2 border-[#111218] rounded-3xl p-6 shadow-neo flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="badge-black px-2.5 py-0.5 text-[10px] font-black uppercase">Step 03</span>
                <span className="text-xs font-mono font-bold text-[#21232C]">Quiz Agent</span>
              </div>
              <h3 className="text-lg font-extrabold text-[#111218] font-display uppercase">Gated Checkpoints</h3>
              <p className="text-xs text-[#21232C] leading-relaxed font-medium">
                Generates rigorous, video-grounded multiple-choice checkpoint tests. Students must pass the quiz to unlock
                the next segment.
              </p>
            </div>
            <div className="p-3 bg-[#FFFDF7] rounded-xl border border-[#111218] text-[10px] font-mono text-[#111218] space-y-1">
              <div>Enforcement: <span className="font-bold">Player Seek Lock (200ms)</span></div>
              <div>Status: <span className="font-bold text-[#111218]">100% Video Grounded</span></div>
            </div>
          </div>

          {/* Step 4: Remember */}
          <div className="bg-[#DDF6BD] border-2 border-[#111218] rounded-3xl p-6 shadow-neo flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="badge-black px-2.5 py-0.5 text-[10px] font-black uppercase">Step 04</span>
                <span className="text-xs font-mono font-bold text-[#21232C]">Recall Agent</span>
              </div>
              <h3 className="text-lg font-extrabold text-[#111218] font-display uppercase">Active Recall Decks</h3>
              <p className="text-xs text-[#21232C] leading-relaxed font-medium">
                Synthesizes physical flashcards directly from lecture transcript terms with self-rating spaced repetition
                feedback (Forgot, Hard, Got it).
              </p>
            </div>
            <div className="p-3 bg-[#FFFDF7] rounded-xl border border-[#111218] text-[10px] font-mono text-[#111218] space-y-1">
              <div>Card Format: <span className="font-bold">Concept / Definition Pairs</span></div>
              <div>Persistence: <span className="font-bold">SQLite / Prisma Store</span></div>
            </div>
          </div>

          {/* Step 5: Focus */}
          <div className="bg-[#111218] text-white border-2 border-[#111218] rounded-3xl p-6 shadow-neo-lg flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="badge-lime px-2.5 py-0.5 text-[10px] font-black uppercase">Step 05</span>
                <span className="text-xs font-mono font-bold text-slate-300">Focus Engine</span>
              </div>
              <h3 className="text-lg font-extrabold text-white font-display uppercase">Deep Focus Space</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Client-side face mesh attention detection monitors eye gaze and head pose. Automatically pauses video on
                cognitive drift.
              </p>
            </div>
            <div className="p-3 bg-[#21232C] rounded-xl border border-white/10 text-[10px] font-mono text-slate-300 space-y-1">
              <div>Privacy: <span className="font-bold text-[#B8FF3D]">100% Local In-Browser</span></div>
              <div>Model: <span className="font-bold text-white">MediaPipe FaceLandmarker</span></div>
            </div>
          </div>

          {/* Step 6: Companion */}
          <div className="bg-[#FFFDF7] border-2 border-[#111218] rounded-3xl p-6 shadow-neo flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="badge-lime px-2.5 py-0.5 text-[10px] font-black uppercase">Step 06</span>
                <span className="text-xs font-mono font-bold text-[#636573]">Saras AI Companion</span>
              </div>
              <h3 className="text-lg font-extrabold text-[#111218] font-display uppercase">Interactive Copilot</h3>
              <p className="text-xs text-[#636573] leading-relaxed font-medium">
                Integrated instructional tutor powered by Groq LLM answers complex conceptual questions and recommends
                curated study pathways.
              </p>
            </div>
            <div className="p-3 bg-[#F5F3EC] rounded-xl border border-[#111218] text-[10px] font-mono text-[#111218] space-y-1">
              <div>Latency: <span className="font-bold">&lt;400ms Streaming</span></div>
              <div>Access: <span className="font-bold text-[#111218]">Always-on Sidebar</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. THE SARAS LOOP: Circular Sequential Diagram
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#FFFDF7] border-y-2 border-[#111218] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="badge-lime px-3 py-1 text-xs font-extrabold uppercase font-display">
              Signature Loop
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111218] font-display uppercase tracking-tight">
              The Saras Active Loop
            </h2>
            <p className="text-xs sm:text-sm text-[#636573] font-medium">
              A continuous cycle of video assimilation, verification, active recall, and focus reinforcement.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: '1. WATCH', role: 'Segmented View', color: '#B8FF3D' },
              { name: '2. UNDERSTAND', role: 'Topic Chapters', color: '#E9DFFF' },
              { name: '3. VERIFY', role: 'Checkpoint Quiz', color: '#DCEEFF' },
              { name: '4. RECALL', role: 'Spaced Cards', color: '#DDF6BD' },
              { name: '5. MASTER', role: 'Deep Focus', color: '#111218' },
              { name: '6. REPEAT', role: 'Lifelong Library', color: '#B8FF3D' },
            ].map((node, idx) => {
              const isActive = activeLoopStep === idx;
              return (
                <div
                  key={node.name}
                  className={`p-5 rounded-2xl border-2 border-[#111218] text-center space-y-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-[#B8FF3D] shadow-neo-md -translate-y-1'
                      : 'bg-[#F5F3EC] hover:bg-[#FFFDF7] shadow-neo-sm'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-[#111218] text-white text-xs font-mono font-bold flex items-center justify-center mx-auto">
                    {idx + 1}
                  </div>
                  <h4 className="text-xs font-black font-display text-[#111218] uppercase">{node.name}</h4>
                  <p className="text-[10px] text-[#636573] font-medium">{node.role}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. TECH STACK SECTION
      ───────────────────────────────────────────────────────────── */}
      <section id="tech-stack" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-2 border-[#111218]">
          <div className="space-y-2">
            <span className="badge-black px-2.5 py-0.5 text-xs font-bold uppercase font-display">
              Engineering Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111218] font-display uppercase tracking-tight">
              Built With Modern AI Infrastructure
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#636573] font-medium max-w-md">
            Production-grade web technologies combined with high-speed LLM inference and client-side machine learning.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            {
              name: 'Next.js 14',
              category: 'Full-Stack React Framework',
              desc: 'App Router, Server Components, and zero-latency dynamic routing.',
              color: 'bg-[#FFFDF7]',
            },
            {
              name: 'Groq Cloud LLaMA 3.3',
              category: 'High-Speed LLM Inference',
              desc: 'Sub-500ms multi-agent generation for quizzes, summaries, and tutor chat.',
              color: 'bg-[#B8FF3D]',
            },
            {
              name: 'Prisma ORM & SQLite',
              category: 'Database & State Store',
              desc: 'Deterministic progress tracking, tasks, streak calculations, and flashcards.',
              color: 'bg-[#FFFDF7]',
            },
            {
              name: 'MediaPipe FaceMesh',
              category: 'Client-Side Vision ML',
              desc: 'On-device face landmark tracking compiled to WebAssembly for 100% private attention detection.',
              color: 'bg-[#E9DFFF]',
            },
            {
              name: 'Tailwind CSS',
              category: 'Neo-Brutalist Design System',
              desc: 'Custom editorial palette (Paper Cream, Ink Black, Electric Lime) and hard offset shadows.',
              color: 'bg-[#DCEEFF]',
            },
            {
              name: 'YouTube IFrame API',
              category: 'Video Runtime & Seek Lock',
              desc: 'Custom programmatic 200ms boundary loop preventing unauthorized segment skipping.',
              color: 'bg-[#FFFDF7]',
            },
            {
              name: 'WebAssembly (WASM)',
              category: 'High-Performance In-Browser ML',
              desc: 'Powers low-overhead attention tracking without GPU server costs.',
              color: 'bg-[#DDF6BD]',
            },
            {
              name: 'TypeScript',
              category: 'Type Safety & Verification',
              desc: 'Strict end-to-end typing across schemas, API routes, and agent contracts.',
              color: 'bg-[#FFFDF7]',
            },
          ].map((tech) => (
            <div
              key={tech.name}
              className={`${tech.color} border-2 border-[#111218] p-5 rounded-2xl shadow-neo hover:-translate-y-1 hover:shadow-neo-lg transition-all flex flex-col justify-between space-y-3 group`}
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-[#636573] block">
                  {tech.category}
                </span>
                <h4 className="text-sm font-black font-display text-[#111218]">{tech.name}</h4>
              </div>
              <p className="text-[11px] text-[#21232C] leading-snug font-medium pt-2 border-t border-[#111218]/15">
                {tech.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. TRY THE PIPELINE: Interactive Simulation
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#111218] text-white py-20 border-y-2 border-[#111218]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <span className="badge-lime px-3 py-1 text-xs font-extrabold uppercase font-display">
              Live Pipeline Demo
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display uppercase tracking-tight">
              Simulate The Ingestion Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-lg mx-auto">
              Test how Saras AI parses a YouTube video stream into structured checkpoint chapters and recall cards.
            </p>
          </div>

          <div className="bg-[#21232C] border-2 border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-neo-lg">
            {/* Input Simulator Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={simUrl}
                onChange={(e) => setSimUrl(e.target.value)}
                placeholder="Paste any YouTube URL..."
                className="w-full bg-[#111218] text-white border-2 border-white/20 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-[#B8FF3D]"
              />
              <button
                onClick={handleRunSimulation}
                disabled={simulationState === 'running'}
                className="neo-btn-lime w-full sm:w-auto px-6 py-3 text-xs font-bold font-display whitespace-nowrap flex items-center justify-center gap-2 flex-shrink-0"
              >
                {simulationState === 'running' ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-[#111218]" />
                    <span>Executing Pipeline...</span>
                  </>
                ) : (
                  <>
                    <span>Simulate Pipeline</span>
                    <ArrowRight className="w-4 h-4 text-[#111218]" />
                  </>
                )}
              </button>
            </div>

            {/* Stepper Pipeline State */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
              {[
                { step: 1, title: 'Transcript Extraction', desc: 'Pulling 1,420 token captions' },
                { step: 2, title: 'Semantic Boundaries', desc: 'Generating 3 topic chapters' },
                { step: 3, title: 'Checkpoint Quizzes', desc: 'Synthesizing 6 gated questions' },
                { step: 4, title: 'Recall Card Synthesis', desc: 'Extracting 8 concept cards' },
                { step: 5, title: 'Lesson Ready', desc: 'Seeding to interactive player' },
              ].map((st) => {
                const isPassed = simStep >= st.step;
                const isCurrent = simStep === st.step;

                return (
                  <div
                    key={st.step}
                    className={`p-3.5 rounded-xl border-2 transition-all ${
                      isPassed
                        ? 'bg-[#111218] border-[#B8FF3D] text-white'
                        : 'bg-[#1A1B22] border-white/10 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold">Phase 0{st.step}</span>
                      {isPassed && <Check className="w-3.5 h-3.5 text-[#B8FF3D]" />}
                    </div>
                    <h5 className="text-xs font-bold font-display uppercase mt-1.5">{st.title}</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">{st.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Result Box */}
            {simulationState === 'completed' && (
              <div className="p-4 bg-[#B8FF3D] text-[#111218] rounded-2xl border-2 border-[#111218] flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#111218] flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-black font-display uppercase">
                      Pipeline Execution Succeeded
                    </h4>
                    <p className="text-xs font-medium">
                      Curriculum generated with 3 gated chapters and 8 active recall cards.
                    </p>
                  </div>
                </div>
                <NextLink
                  href="/"
                  className="px-5 py-2 rounded-xl bg-[#111218] text-white text-xs font-bold font-display hover:bg-[#21232C] transition-colors flex-shrink-0"
                >
                  Launch In App →
                </NextLink>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. PRIVACY & ATTENTION SECTION
      ───────────────────────────────────────────────────────────── */}
      <section id="privacy" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <div className="bg-[#FFFDF7] border-2 border-[#111218] rounded-3xl p-8 sm:p-12 shadow-neo-lg relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#DDF6BD] border-2 border-[#111218] rounded-md shadow-neo-sm">
                <Lock className="w-3.5 h-3.5 text-[#111218]" />
                <span className="text-xs font-bold font-display uppercase tracking-wider text-[#111218]">
                  Zero Server Surveillance
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display uppercase tracking-tight text-[#111218]">
                Your Camera Stays <br />
                <span className="bg-[#B8FF3D] px-2.5 py-0.5 rounded-lg border-2 border-[#111218]">
                  With You.
                </span>
              </h2>

              <p className="text-sm text-[#636573] font-medium leading-relaxed">
                Deep Focus runs entirely inside your browser using Google MediaPipe WebAssembly. No camera frames,
                recordings, or facial biometric images are ever uploaded or transmitted to any server.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  '100% Client-side local inference in browser memory',
                  'Automatic video pause when looking away for >4 seconds',
                  'Local session logs stored strictly in browser localStorage',
                  'Instant camera release upon session completion',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-bold text-[#111218]">
                    <Check className="w-4 h-4 text-[#8ECC24]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Flow Diagram */}
            <div className="lg:col-span-5 bg-[#F5F3EC] border-2 border-[#111218] rounded-2xl p-6 shadow-neo space-y-4">
              <h4 className="text-xs font-black font-display uppercase text-[#111218] pb-2 border-b border-[#111218]/20">
                Privacy Architecture Flow
              </h4>

              <div className="space-y-2 text-xs font-mono font-bold">
                <div className="p-2.5 bg-[#FFFDF7] rounded-lg border border-[#111218] flex items-center justify-between">
                  <span>1. Webcam Stream</span>
                  <span className="text-[#8ECC24]">Local Browser</span>
                </div>
                <div className="p-2.5 bg-[#FFFDF7] rounded-lg border border-[#111218] flex items-center justify-between">
                  <span>2. MediaPipe WASM</span>
                  <span className="text-[#8ECC24]">Client RAM</span>
                </div>
                <div className="p-2.5 bg-[#FFFDF7] rounded-lg border border-[#111218] flex items-center justify-between">
                  <span>3. Attention Event</span>
                  <span className="text-[#8ECC24]">UI State</span>
                </div>
                <div className="p-2.5 bg-[#FFD1C7] rounded-lg border border-[#111218] flex items-center justify-between text-[#111218]">
                  <span>Server Upload</span>
                  <span className="text-red-700 font-black">BLOCKED (0 KB)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. WHERE WE ARE: Development Status & Roadmap
      ───────────────────────────────────────────────────────────── */}
      <section id="status" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-2 border-[#111218]">
          <div className="space-y-2">
            <span className="badge-black px-2.5 py-0.5 text-xs font-bold uppercase font-display">
              Transparent Engineering
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111218] font-display uppercase tracking-tight">
              Project Development Status
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#636573] font-medium max-w-md">
            Clear classification of implemented systems, active development, and future research explorations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status 1: Working */}
          <div className="bg-[#DDF6BD] border-2 border-[#111218] rounded-3xl p-6 shadow-neo space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#111218]">
              <span className="badge-black px-2.5 py-0.5 text-[10px] font-black uppercase">
                ● Implemented
              </span>
              <span className="text-xs font-mono font-bold text-[#111218]">Working</span>
            </div>
            <ul className="space-y-2.5 text-xs font-medium text-[#111218]">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#111218] flex-shrink-0 mt-0.5" />
                <span>YouTube Transcript Ingestion & Segmenting</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#111218] flex-shrink-0 mt-0.5" />
                <span>Programmatic 200ms Seek-Lock Player Gating</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#111218] flex-shrink-0 mt-0.5" />
                <span>Video-Grounded Multiple Choice Quizzes</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#111218] flex-shrink-0 mt-0.5" />
                <span>Spaced Repetition Flashcard Studio</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#111218] flex-shrink-0 mt-0.5" />
                <span>Client-Side Local Attention Detection</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#111218] flex-shrink-0 mt-0.5" />
                <span>Personal Learning History & Progress Tracking</span>
              </li>
            </ul>
          </div>

          {/* Status 2: In Development */}
          <div className="bg-[#DCEEFF] border-2 border-[#111218] rounded-3xl p-6 shadow-neo space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#111218]">
              <span className="badge-black px-2.5 py-0.5 text-[10px] font-black uppercase">
                ◐ Active Build
              </span>
              <span className="text-xs font-mono font-bold text-[#111218]">In Development</span>
            </div>
            <ul className="space-y-2.5 text-xs font-medium text-[#111218]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#111218] flex-shrink-0 mt-1.5" />
                <span>Multi-language transcript translation pipelines</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#111218] flex-shrink-0 mt-1.5" />
                <span>Personalized adaptive quiz difficulty scaling</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#111218] flex-shrink-0 mt-1.5" />
                <span>PDF / Lecture slide ingestion integration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#111218] flex-shrink-0 mt-1.5" />
                <span>Automated SM-2 spaced repetition scheduling</span>
              </li>
            </ul>
          </div>

          {/* Status 3: Exploring */}
          <div className="bg-[#E9DFFF] border-2 border-[#111218] rounded-3xl p-6 shadow-neo space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#111218]">
              <span className="badge-black px-2.5 py-0.5 text-[10px] font-black uppercase">
                ○ Research
              </span>
              <span className="text-xs font-mono font-bold text-[#111218]">Exploring</span>
            </div>
            <ul className="space-y-2.5 text-xs font-medium text-[#111218]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#111218] flex-shrink-0 mt-1.5" />
                <span>Multimodal video frame diagram reasoning</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#111218] flex-shrink-0 mt-1.5" />
                <span>Global cross-curriculum knowledge graphs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#111218] flex-shrink-0 mt-1.5" />
                <span>Peer-to-peer active recall study rooms</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#111218] flex-shrink-0 mt-1.5" />
                <span>Voice-interactive AI viva voce examinations</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. FINAL CALL TO ACTION
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-[#111218] text-white border-2 border-[#111218] rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-neo-lg relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="badge-lime px-3 py-1 text-xs font-extrabold uppercase font-display">
              Start Active Learning
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display uppercase tracking-tight text-white leading-tight">
              Ready to Learn <br />
              <span className="text-[#B8FF3D]">Differently?</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              Paste any lecture or educational video to generate structured topic chapters, checkpoint quizzes, and recall flashcards.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <NextLink
              href="/"
              className="neo-btn-lime px-8 py-3.5 text-sm font-bold font-display flex items-center gap-2 shadow-neo"
            >
              <span>Launch Saras AI Now</span>
              <ArrowRight className="w-4 h-4 text-[#111218]" />
            </NextLink>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          11. EDITORIAL FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="border-t-2 border-[#111218] bg-[#FFFDF7] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#B8FF3D] border-2 border-[#111218] flex items-center justify-center shadow-neo-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#111218] fill-[#111218]" />
            </div>
            <span className="font-display font-black text-sm text-[#111218]">
              Saras AI — Learn. Recall. Understand.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-bold font-display uppercase text-[#636573]">
            <NextLink href="/" className="hover:text-[#111218]">
              App Workspace
            </NextLink>
            <NextLink href="/flashcards" className="hover:text-[#111218]">
              Flashcards
            </NextLink>
            <NextLink href="/focus" className="hover:text-[#111218]">
              Deep Focus
            </NextLink>
            <a
              href="https://github.com/badgujarkunal93-blip/Saras-AI"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#111218] flex items-center gap-1"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <span className="text-[11px] font-mono text-[#636573]">
            MIT Open Source · AI/ML Project
          </span>
        </div>
      </footer>
    </div>
  );
}
