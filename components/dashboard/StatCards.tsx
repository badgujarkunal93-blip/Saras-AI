'use client';

import React, { useState, useEffect } from 'react';
import {
  Check,
  Sparkles,
  Flame,
  Eye,
  TrendingUp,
  Award,
  Layers,
} from 'lucide-react';

interface StatCardsProps {
  totalCompletedVideos: number;
  totalVideos: number;
  masteredFlashcards: number;
  totalFlashcards: number;
  flashcardMasteryPercent: number;
  studyStreakDays?: number;
  focusScore?: number;
}

export function StatCards({
  totalCompletedVideos,
  totalVideos,
  masteredFlashcards,
  totalFlashcards,
  flashcardMasteryPercent,
  studyStreakDays = 3,
  focusScore = 94,
}: StatCardsProps) {
  // Smooth animated mount transitions for numbers and progress rings
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const lessonsPercent =
    totalVideos > 0 ? Math.round((totalCompletedVideos / totalVideos) * 100) : 0;
  const remainingLessons = Math.max(0, totalVideos - totalCompletedVideos);

  // 7-Day Activity Matrix for Study Streak
  const weekDays = [
    { day: 'Mon', active: true, isToday: false },
    { day: 'Tue', active: true, isToday: false },
    { day: 'Wed', active: true, isToday: true },
    { day: 'Thu', active: false, isToday: false },
    { day: 'Fri', active: false, isToday: false },
    { day: 'Sat', active: false, isToday: false },
    { day: 'Sun', active: false, isToday: false },
  ];

  // Circumference for 42px SVG rings (radius = 16px -> 2 * PI * 16 ≈ 100.53)
  const ringCircumference = 2 * Math.PI * 16;
  const flashcardStrokeOffset =
    ringCircumference - (ringCircumference * (isMounted ? flashcardMasteryPercent : 0)) / 100;
  const focusStrokeOffset =
    ringCircumference - (ringCircumference * (isMounted ? focusScore : 0)) / 100;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* ─────────────────────────────────────────────────────────────
          CARD 1: LESSONS COMPLETED (Mint / Cyan Accent)
      ───────────────────────────────────────────────────────────── */}
      <div
        className="glass-card p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden h-[158px] group hover:border-[#4ADEB5]/30"
        style={{
          background:
            'radial-gradient(circle at 90% 0%, rgba(74,222,181,0.08), transparent 45%), rgba(15, 23, 42, 0.68)',
        }}
      >
        {/* Top: Label + Mint Icon */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Lessons Completed
          </span>
          <div className="w-6 h-6 rounded-full bg-[#4ADEB5]/10 border border-[#4ADEB5]/25 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-[#4ADEB5]" />
          </div>
        </div>

        {/* Middle: Large Metric */}
        <div className="my-auto">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight">
              {totalCompletedVideos}
            </span>
            <span className="text-sm font-normal text-slate-400">/ {totalVideos}</span>
          </div>

          {/* Thin Linear Progress Bar (Mint -> Cyan) */}
          <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden mt-2">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: isMounted ? `${lessonsPercent}%` : '0%',
                background: 'linear-gradient(90deg, #4ADEB5, #67D7FF)',
              }}
            />
          </div>
        </div>

        {/* Bottom Context */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/[0.04]">
          <span>
            {remainingLessons > 0
              ? `${remainingLessons} lesson${remainingLessons > 1 ? 's' : ''} remaining`
              : 'All lessons completed! 🎓'}
          </span>
          <span className="font-mono font-medium text-[#4ADEB5]">{lessonsPercent}%</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CARD 2: FLASHCARDS MASTERED (Purple / Soft Cyan Ring)
      ───────────────────────────────────────────────────────────── */}
      <div
        className="glass-card p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden h-[158px] group hover:border-[#8B7CFF]/35"
        style={{
          background:
            'radial-gradient(circle at 90% 0%, rgba(139,124,255,0.10), transparent 45%), rgba(15, 23, 42, 0.68)',
        }}
      >
        {/* Top: Label + Purple Sparkle Icon */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Flashcards Mastered
          </span>
          <div className="w-6 h-6 rounded-full bg-[#8B7CFF]/10 border border-[#8B7CFF]/25 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5 text-[#8B7CFF]" />
          </div>
        </div>

        {/* Middle: Metric + Circular Mastery Ring */}
        <div className="flex items-center justify-between my-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight">
                {masteredFlashcards}
              </span>
              <span className="text-sm font-normal text-slate-400">/ {totalFlashcards}</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Recall Deck</span>
          </div>

          {/* Circular SVG Mastery Ring */}
          <div className="relative w-11 h-11 flex items-center justify-center flex-shrink-0">
            <svg className="w-11 h-11 -rotate-90" viewBox="0 0 38 38">
              {/* Track */}
              <circle
                cx="19"
                cy="19"
                r="16"
                fill="none"
                stroke="rgba(255, 255, 255, 0.07)"
                strokeWidth="3"
              />
              {/* Gradient Stroke */}
              <defs>
                <linearGradient id="purpleRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B7CFF" />
                  <stop offset="100%" stopColor="#67D7FF" />
                </linearGradient>
              </defs>
              <circle
                cx="19"
                cy="19"
                r="16"
                fill="none"
                stroke="url(#purpleRingGradient)"
                strokeWidth="3"
                strokeDasharray={ringCircumference}
                strokeDashoffset={flashcardStrokeOffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <span className="absolute text-[10px] font-bold font-mono text-[#A78BFA]">
              {flashcardMasteryPercent}%
            </span>
          </div>
        </div>

        {/* Bottom Context */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/[0.04]">
          <span>{totalFlashcards} cards in deck</span>
          <span className="text-[#8B7CFF] font-medium text-[10px]">Active Deck</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CARD 3: STUDY STREAK (Warm Amber Accent + 7-Day Matrix)
      ───────────────────────────────────────────────────────────── */}
      <div
        className="glass-card p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden h-[158px] group hover:border-[#F5C95B]/35"
        style={{
          background:
            'radial-gradient(circle at 90% 0%, rgba(245,201,91,0.08), transparent 45%), rgba(15, 23, 42, 0.68)',
        }}
      >
        {/* Top: Label + Amber Flame Icon */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Study Streak
          </span>
          <div className="w-6 h-6 rounded-full bg-[#F5C95B]/10 border border-[#F5C95B]/25 flex items-center justify-center">
            <Flame className="w-3.5 h-3.5 text-[#F5C95B] fill-[#F5C95B]/20" />
          </div>
        </div>

        {/* Middle: Metric + 7-Day Activity Visualization */}
        <div className="my-auto space-y-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight">
              {studyStreakDays}
            </span>
            <span className="text-sm font-normal text-slate-400">Days</span>
          </div>

          {/* 7-Day Activity Row */}
          <div className="flex items-center justify-between gap-1 pt-0.5">
            {weekDays.map((item, idx) => {
              const isPastActive = item.active && !item.isToday;
              const isTodayActive = item.isToday;

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase">{item.day}</span>
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                      isTodayActive
                        ? 'bg-[#F5C95B] text-[#070B16] ring-2 ring-[#F5C95B]/30 shadow-[0_0_8px_rgba(245,201,91,0.5)]'
                        : isPastActive
                        ? 'bg-[#F5C95B]/20 border border-[#F5C95B]/40 text-[#F5C95B]'
                        : 'bg-white/[0.04] border border-white/[0.06] text-transparent'
                    }`}
                  >
                    {isTodayActive || isPastActive ? (
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    ) : (
                      <span className="w-1 h-1 rounded-full bg-white/[0.15]" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Context */}
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/[0.04]">
          <span className="text-[#F5C95B] font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5C95B] animate-pulse" />
            Goal achieved today
          </span>
          <span className="text-slate-500 font-mono text-[10px]">🔥 Active</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CARD 4: FOCUS SCORE (Soft Cyan / Violet Gauge)
      ───────────────────────────────────────────────────────────── */}
      <div
        className="glass-card p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden h-[158px] group hover:border-[#67D7FF]/35"
        style={{
          background:
            'radial-gradient(circle at 90% 0%, rgba(103,215,255,0.08), transparent 45%), rgba(15, 23, 42, 0.68)',
        }}
      >
        {/* Top: Label + Cyan Eye Icon */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Focus Score
          </span>
          <div className="w-6 h-6 rounded-full bg-[#67D7FF]/10 border border-[#67D7FF]/25 flex items-center justify-center">
            <Eye className="w-3.5 h-3.5 text-[#67D7FF]" />
          </div>
        </div>

        {/* Middle: Focal Metric + Radial Score Gauge */}
        <div className="flex items-center justify-between my-auto">
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight">
              {focusScore}%
            </div>
            <span className="text-[11px] font-medium text-slate-300 block mt-0.5">
              Excellent focus
            </span>
          </div>

          {/* Radial Score Gauge */}
          <div className="relative w-11 h-11 flex items-center justify-center flex-shrink-0">
            <svg className="w-11 h-11 -rotate-90" viewBox="0 0 38 38">
              {/* Track */}
              <circle
                cx="19"
                cy="19"
                r="16"
                fill="none"
                stroke="rgba(255, 255, 255, 0.07)"
                strokeWidth="3"
              />
              {/* Gradient Stroke */}
              <defs>
                <linearGradient id="focusRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#67D7FF" />
                  <stop offset="100%" stopColor="#8B7CFF" />
                </linearGradient>
              </defs>
              <circle
                cx="19"
                cy="19"
                r="16"
                fill="none"
                stroke="url(#focusRingGradient)"
                strokeWidth="3"
                strokeDasharray={ringCircumference}
                strokeDashoffset={focusStrokeOffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <span className="absolute text-[10px] font-bold font-mono text-[#67D7FF]">
              {focusScore}%
            </span>
          </div>
        </div>

        {/* Bottom Context: Weekly Trend */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/[0.04]">
          <span className="flex items-center gap-1 font-medium">
            <span className="text-[#4ADEB5]">↑ 8%</span>
            <span>from last week</span>
          </span>
          <span className="text-slate-500 font-mono text-[10px]">Strict Mode</span>
        </div>
      </div>
    </section>
  );
}
