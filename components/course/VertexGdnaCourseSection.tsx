'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Play,
  Clock,
  Layers,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  HelpCircle,
  PlaySquare,
  ShieldCheck,
  Cpu,
  GraduationCap,
} from 'lucide-react';
import {
  VERTEX_GDNA_COURSE,
  CourseVideo,
  CourseSegment,
} from '@/lib/data/vertexGdnaCourse';
import { formatTime } from '@/lib/utils';

interface VertexGdnaCourseSectionProps {
  onLaunchVideo?: (videoId: string) => void;
  completedVideoIds?: string[];
}

export function VertexGdnaCourseSection({
  onLaunchVideo,
  completedVideoIds = [],
}: VertexGdnaCourseSectionProps) {
  const router = useRouter();
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);

  const activeModule = VERTEX_GDNA_COURSE.modules[0];
  const videos = activeModule.videos;

  const handleStartVideo = (videoId: string) => {
    if (onLaunchVideo) {
      onLaunchVideo(videoId);
    } else {
      router.push(`/video/${videoId}`);
    }
  };

  const toggleExpand = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedChapterId(prev => (prev === videoId ? null : videoId));
  };

  return (
    <section id="vertex-gdna-course" className="space-y-6 pt-4">
      {/* Neo-Brutalist Main Course Container */}
      <div className="bg-[#FFFDF7] border-2 border-[#111218] rounded-3xl p-6 sm:p-8 shadow-neo-lg relative overflow-hidden space-y-6">
        {/* Background Decorative Accent */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#B8FF3D]/20 blur-2xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b-2 border-[#111218]">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge-lime px-3 py-1 text-xs font-extrabold uppercase font-display flex items-center gap-1.5 shadow-neo-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#111218]" />
                Vertex GDNA Course
              </span>
              <span className="bg-[#111218] text-white px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider">
                Specialization Track
              </span>
              <span className="badge-black px-2.5 py-0.5 text-[10px] font-bold uppercase font-display">
                Created with 3Blue1Brown
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111218] font-display uppercase tracking-tight">
              Vertex GDNA: Deep Learning & Neural Networks
            </h2>
            <p className="text-xs sm:text-sm text-[#636573] max-w-3xl font-medium leading-relaxed">
              {VERTEX_GDNA_COURSE.description}
            </p>
          </div>

          {/* Quick Metrics Badge Group */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap lg:flex-nowrap">
            <div className="bg-[#F5F3EC] border-2 border-[#111218] rounded-xl px-3 py-2 text-center shadow-neo-sm">
              <div className="text-lg font-extrabold text-[#111218] font-mono leading-none">10</div>
              <div className="text-[9px] font-bold text-[#636573] uppercase tracking-wider font-display mt-0.5">Chapters</div>
            </div>
            <div className="bg-[#F5F3EC] border-2 border-[#111218] rounded-xl px-3 py-2 text-center shadow-neo-sm">
              <div className="text-lg font-extrabold text-[#111218] font-mono leading-none">33</div>
              <div className="text-[9px] font-bold text-[#636573] uppercase tracking-wider font-display mt-0.5">Segments</div>
            </div>
            <div className="bg-[#B8FF3D] border-2 border-[#111218] rounded-xl px-3 py-2 text-center shadow-neo-sm">
              <div className="text-lg font-extrabold text-[#111218] font-mono leading-none">66</div>
              <div className="text-[9px] font-bold text-[#111218] uppercase tracking-wider font-display mt-0.5">Quizzes</div>
            </div>
          </div>
        </div>

        {/* Module Header Card */}
        <div className="bg-[#111218] text-white border-2 border-[#111218] rounded-2xl p-5 sm:p-6 shadow-neo space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="bg-[#B8FF3D] text-[#111218] font-mono font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                  Module 1
                </span>
                <span className="text-[11px] font-mono text-slate-300">
                  Specialization Course Module
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white font-display tracking-tight">
                {activeModule.title}
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl font-medium leading-relaxed">
                {activeModule.description}
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-shrink-0">
              {/* Quick Start Module */}
              <button
                onClick={() => handleStartVideo(videos[0].id)}
                className="neo-btn-lime px-5 py-2.5 text-xs font-bold inline-flex items-center gap-2 shadow-neo-sm"
              >
                <Play className="w-4 h-4 fill-[#111218]" />
                <span>Start Module (Chapter 1)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Course Video Chapters Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-[#111218] font-display uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#111218]" />
              <span>Course Chapters ({videos.length}) — Pre-Ingested & Segmented</span>
            </h4>
            <span className="text-[11px] font-mono font-bold text-[#636573]">
              Checkpoint Gating Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video, idx) => {
              const isExpanded = expandedChapterId === video.id;
              const isCompleted = completedVideoIds.includes(video.id);

              return (
                <div
                  key={video.id}
                  onClick={() => handleStartVideo(video.id)}
                  className="bg-[#FFFDF7] border-2 border-[#111218] rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between shadow-neo hover:-translate-y-1 hover:shadow-neo-lg transition-all relative"
                >
                  {/* Thumbnail Banner */}
                  <div className="relative aspect-video w-full bg-slate-900 border-b-2 border-[#111218] overflow-hidden">
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Chapter Pill */}
                    <div className="absolute top-2 left-2 bg-[#111218] text-white border border-[#111218] px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase tracking-wider">
                      Chapter {String(video.chapter_number).padStart(2, '0')}
                    </div>

                    {/* Duration Pill */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-[#111218] text-[10px] font-mono font-bold text-white border border-[#111218]">
                      {formatTime(video.duration_seconds)}
                    </div>

                    {/* Difficulty Badge */}
                    <div className="absolute top-2 right-2">
                      <span className="bg-[#B8FF3D] text-[#111218] border border-[#111218] px-2 py-0.5 rounded text-[9px] font-extrabold font-display uppercase">
                        {video.difficulty}
                      </span>
                    </div>

                    {/* Play Hover Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-[#B8FF3D] border-2 border-[#111218] flex items-center justify-center text-[#111218] shadow-neo-sm transform scale-90 group-hover:scale-100 transition-transform">
                        <Play className="w-4 h-4 fill-[#111218] ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-[#636573] font-bold font-display uppercase tracking-wider">
                        <span>{video.channel}</span>
                        <span className="text-[#111218] font-mono">{video.segments.length} Chapters</span>
                      </div>

                      <h5 className="text-sm font-extrabold text-[#111218] line-clamp-2 leading-snug font-display group-hover:text-black">
                        {video.title}
                      </h5>

                      <p className="text-xs text-[#636573] line-clamp-2 leading-relaxed font-medium">
                        {video.summary}
                      </p>
                    </div>

                    {/* Expandable Segments List */}
                    <div className="pt-2 border-t-2 border-[#111218]/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-[#636573]">
                          Segmented Units ({video.segments.length})
                        </span>
                        <button
                          type="button"
                          onClick={(e) => toggleExpand(video.id, e)}
                          className="text-[10px] font-bold text-[#111218] hover:underline flex items-center gap-0.5 font-display"
                        >
                          <span>{isExpanded ? 'Hide' : 'Inspect'}</span>
                          <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>
                      </div>

                      {/* Preview chips when collapsed */}
                      {!isExpanded && (
                        <div className="space-y-1">
                          {video.segments.slice(0, 2).map((seg, sIdx) => (
                            <div
                              key={seg.id}
                              className="text-[11px] text-[#21232C] truncate font-medium flex items-center gap-1.5"
                            >
                              <span className="w-4 h-4 rounded-md bg-[#EAE6DB] border border-[#111218]/30 text-[9px] font-mono font-bold flex items-center justify-center flex-shrink-0">
                                {sIdx + 1}
                              </span>
                              <span className="truncate">{seg.title}</span>
                            </div>
                          ))}
                          {video.segments.length > 2 && (
                            <div className="text-[10px] text-[#636573] font-mono pl-5">
                              + {video.segments.length - 2} more gated segments
                            </div>
                          )}
                        </div>
                      )}

                      {/* Expanded View with Full Timestamps and Checkpoints */}
                      {isExpanded && (
                        <div className="bg-[#F5F3EC] border border-[#111218] rounded-xl p-2.5 space-y-2 mt-1">
                          {video.segments.map((seg, sIdx) => (
                            <div
                              key={seg.id}
                              className="bg-[#FFFDF7] border border-[#111218]/40 rounded-lg p-2 space-y-1 text-left"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-extrabold text-[#111218] font-display">
                                  Part {sIdx + 1}: {seg.title}
                                </span>
                                <span className="text-[9px] font-mono bg-[#EAE6DB] px-1.5 py-0.2 rounded font-bold text-[#111218]">
                                  {formatTime(seg.start_seconds)} - {formatTime(seg.end_seconds)}
                                </span>
                              </div>
                              <p className="text-[10px] text-[#636573] leading-snug line-clamp-2">
                                {seg.summary}
                              </p>
                              <div className="text-[9px] font-mono text-[#8ECC24] font-bold flex items-center gap-1 pt-0.5">
                                <HelpCircle className="w-2.5 h-2.5" />
                                <span>{seg.quiz_questions.length} Comprehension Checkpoint Quizzes</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Launch Button */}
                      <div className="pt-2 flex items-center justify-between">
                        <span className="badge-lime px-2 py-0.5 text-[9px] font-extrabold uppercase">
                          Ready to Learn
                        </span>
                        <div className="circle-arrow-btn">
                          <ArrowRight className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
