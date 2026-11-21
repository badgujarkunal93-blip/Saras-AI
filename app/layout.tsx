'use client';

import React, { useState, useEffect } from 'react';
import './globals.css';
import { Navbar } from '@/components/navbar/Navbar';
import { ChatAssistant } from '@/components/chat/ChatAssistant';
import { TasksPanel } from '@/components/tasks/TasksPanel';
import { InteractiveGridBackground } from '@/components/background/InteractiveGridBackground';
import NextLink from 'next/link';
import {
  Compass,
  Layers,
  Eye,
  Bot,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bookmark,
  Play,
  BookOpen,
  ListTodo,
  CheckCircle2,
  Workflow,
  Network,
  RotateCw,
  GraduationCap,
  ListOrdered,
  ArrowRight,
  PlaySquare,
} from 'lucide-react';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { usePathname } from 'next/navigation';
import { getVertexGdnaVideo, getAllVertexGdnaVideos } from '@/lib/data/vertexGdnaCourse';
import { formatTime } from '@/lib/utils';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'module' | 'workspace'>('module');

  // Detect whether current page is a Vertex GDNA Course video or overview
  const isVideoRoute = pathname.startsWith('/video/');
  const currentVideoId = isVideoRoute ? pathname.split('/')[2] : null;
  const currentCourseVideo = currentVideoId ? getVertexGdnaVideo(currentVideoId) : null;
  const isVertexCourse = Boolean(currentCourseVideo) || pathname === '/course/vertex-gdna';
  const moduleVideos = getAllVertexGdnaVideos();

  useEffect(() => {
    if (isVertexCourse) {
      setSidebarTab('module');
    }
  }, [pathname, isVertexCourse]);

  const isLanding =
    pathname === '/' ||
    pathname === '/landing' ||
    pathname === '/welcome' ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/flow-diagram');

  useEffect(() => {
    const handleOpenChat = () => setIsChatOpen(true);
    const handleOpenTasks = () => setIsTasksOpen(true);
    window.addEventListener('open-chat-drawer', handleOpenChat);
    window.addEventListener('open-tasks-panel', handleOpenTasks);
    return () => {
      window.removeEventListener('open-chat-drawer', handleOpenChat);
      window.removeEventListener('open-tasks-panel', handleOpenTasks);
    };
  }, []);

  const navItems = [
    { href: '/discover', label: 'Discover', icon: Compass },
    { href: '/discover#explore-section', label: 'Explore Lessons', icon: BookOpen },
    { href: '/exam', label: 'Exam Mode', icon: GraduationCap },
    { href: '/revision', label: 'AI Revision', icon: RotateCw },
    { href: '/knowledge', label: 'Knowledge Map', icon: Network },
    { href: '/flashcards', label: 'Flashcards Studio', icon: Layers },
    { href: '/focus', label: 'Deep Focus', icon: Eye },
    { href: '/landing', label: 'AI Architecture', icon: Workflow },
  ];

  return (
    <html lang="en">
      <head>
        <title>Saras AI — Learn. Recall. Understand.</title>
        <meta
          name="description"
          content="Turn any video or topic into an interactive learning session with Saras AI quizzes, flashcards, and recall."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-[#F5F3EC] text-[#111218] antialiased flex flex-col relative selection:bg-[#B8FF3D] selection:text-[#111218]">
        <AuthProvider>
          {/* Subtle Interactive Paper Dot Grid Background Layer */}
          <InteractiveGridBackground />

        {isLanding ? (
          <main className="w-full flex-1 relative z-10">{children}</main>
        ) : (
          <>
            {/* Top Navbar */}
            <div className="relative z-40">
              <Navbar />
            </div>

            {/* Main Workspace Layout */}
            <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6 relative z-10">
              {/* Editorial Neo-Brutalist Sidebar */}
              <aside
                className={`hidden md:flex flex-col transition-all duration-200 flex-shrink-0 ${
                  isSidebarCollapsed ? 'w-16' : (isVertexCourse && sidebarTab === 'module' ? 'w-72' : 'w-60')
                }`}
              >
            <div className="bg-[#FFFDF7] border-2 border-[#111218] rounded-2xl p-3.5 flex flex-col h-full sticky top-20 max-h-[calc(100vh-6.5rem)] shadow-neo space-y-3">
              {/* Header & Mode Switcher */}
              <div className="flex items-center justify-between pb-2 border-b-2 border-[#111218]/10">
                {!isSidebarCollapsed ? (
                  isVertexCourse ? (
                    <div className="flex items-center gap-1 bg-[#F5F3EC] p-0.5 rounded-lg border border-[#111218]">
                      <button
                        onClick={() => setSidebarTab('module')}
                        className={`text-[10px] font-extrabold font-display uppercase tracking-wider px-2 py-0.5 rounded transition-all ${
                          sidebarTab === 'module'
                            ? 'bg-[#B8FF3D] text-[#111218] border border-[#111218] shadow-neo-sm'
                            : 'text-[#636573] hover:text-[#111218]'
                        }`}
                      >
                        Module 1 ({moduleVideos.length})
                      </button>
                      <button
                        onClick={() => setSidebarTab('workspace')}
                        className={`text-[10px] font-bold font-display uppercase tracking-wider px-1.5 py-0.5 rounded transition-all ${
                          sidebarTab === 'workspace'
                            ? 'bg-[#B8FF3D] text-[#111218] border border-[#111218] shadow-neo-sm'
                            : 'text-[#636573] hover:text-[#111218]'
                        }`}
                      >
                        Nav
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold font-display uppercase tracking-wider text-[#111218] px-1.5 py-0.5 bg-[#B8FF3D] rounded border border-[#111218]">
                      Workspace
                    </span>
                  )
                ) : (
                  <span className="text-[10px] font-mono font-bold text-[#111218]">
                    {isVertexCourse && sidebarTab === 'module' ? 'M1' : 'WS'}
                  </span>
                )}

                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="p-1 rounded-lg text-[#111218] hover:bg-[#F5F3EC] border border-transparent hover:border-[#111218] transition-all ml-auto"
                  title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  {isSidebarCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronLeft className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* View 1: Vertex GDNA Course Module Chapters List */}
              {isVertexCourse && sidebarTab === 'module' ? (
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden space-y-2">
                  {!isSidebarCollapsed && (
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-[#636573]">
                        Module Chapters
                      </span>
                      <NextLink
                        href="/course/vertex-gdna"
                        className="text-[10px] font-bold text-[#111218] hover:underline font-display uppercase"
                      >
                        Overview ↗
                      </NextLink>
                    </div>
                  )}

                  <div className="overflow-y-auto flex-1 pr-1 space-y-1.5">
                    {moduleVideos.map((mVideo, idx) => {
                      const isCurrent =
                        currentVideoId === mVideo.id || currentVideoId === mVideo.youtube_video_id;
                      const cleanTitle = mVideo.title.split('|')[0].trim();

                      if (isSidebarCollapsed) {
                        return (
                          <NextLink
                            key={mVideo.id}
                            href={`/video/${mVideo.id}`}
                            className={`flex items-center justify-center py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                              isCurrent
                                ? 'bg-[#B8FF3D] text-[#111218] border-2 border-[#111218] shadow-neo-sm'
                                : 'text-[#636573] hover:bg-[#F5F3EC] hover:text-[#111218] border border-transparent hover:border-[#111218]/20'
                            }`}
                            title={`Ch ${idx + 1}: ${cleanTitle}`}
                          >
                            {String(idx + 1).padStart(2, '0')}
                          </NextLink>
                        );
                      }

                      return (
                        <NextLink
                          key={mVideo.id}
                          href={`/video/${mVideo.id}`}
                          className={`block p-2 rounded-xl text-left transition-all ${
                            isCurrent
                              ? 'bg-[#B8FF3D] text-[#111218] border-2 border-[#111218] shadow-neo-sm'
                              : 'bg-[#FFFDF7] text-[#111218] hover:bg-[#F5F3EC] border-2 border-[#111218]/10 hover:border-[#111218]/40'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono pb-0.5">
                            <span className="font-extrabold uppercase">
                              Chapter {String(mVideo.chapter_number).padStart(2, '0')}
                            </span>
                            <span className="text-[#636573] font-medium">
                              {formatTime(mVideo.duration_seconds)}
                            </span>
                          </div>
                          <div
                            className={`text-xs font-display leading-snug line-clamp-2 ${
                              isCurrent ? 'font-extrabold text-[#111218]' : 'font-semibold text-[#21232C]'
                            }`}
                          >
                            {cleanTitle}
                          </div>
                        </NextLink>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* View 2: Standard Workspace Navigation */
                <>
                  <nav className="space-y-1.5">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href || (item.href === '/' && pathname === '/');
                      return (
                        <NextLink
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold font-display transition-all ${
                            isActive && !item.href.includes('#')
                              ? 'bg-[#B8FF3D] text-[#111218] border-2 border-[#111218] shadow-neo-sm'
                              : 'text-[#111218] hover:bg-[#F5F3EC] border-2 border-transparent hover:border-[#111218]/20'
                          }`}
                          title={item.label}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          {!isSidebarCollapsed && <span>{item.label}</span>}
                        </NextLink>
                      );
                    })}
                  </nav>

                  {/* Your Space Section */}
                  {!isSidebarCollapsed && (
                    <div className="pt-3 border-t-2 border-[#111218]/10 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#636573] pl-1 block">
                        Your Space
                      </span>
                      <div className="space-y-1">
                        <NextLink
                          href="/flashcards"
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#111218] hover:bg-[#E9DFFF] hover:border hover:border-[#111218] transition-all"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#B8FF3D] border border-[#111218]" />
                          <span>Active Recall Deck</span>
                        </NextLink>
                        <NextLink
                          href="/focus"
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#111218] hover:bg-[#DCEEFF] hover:border hover:border-[#111218] transition-all"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#67D7FF] border border-[#111218]" />
                          <span>Deep Focus Mode</span>
                        </NextLink>
                        <button
                          type="button"
                          onClick={() => setIsTasksOpen(true)}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#111218] hover:bg-[#DDF6BD] hover:border hover:border-[#111218] transition-all text-left"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#111218]" />
                          <span>Study Goals & Tasks</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Bottom Assistant Entry - THE SINGLE OFFICIAL TRIGGER */}
              <div className="pt-3 border-t-2 border-[#111218]/10 mt-auto">
                <button
                  onClick={() => setIsChatOpen(true)}
                  className={`w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#111218] text-white hover:bg-[#21232C] border-2 border-[#111218] shadow-neo-sm text-xs font-bold font-display transition-all ${
                    isSidebarCollapsed ? 'px-2' : ''
                  }`}
                  title="Ask Saras"
                >
                  <Sparkles className="w-4 h-4 text-[#B8FF3D] flex-shrink-0" />
                  {!isSidebarCollapsed && <span>Ask Saras</span>}
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>

        {/* AI Assistant Drawer */}
        <ChatAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

        {/* Study Goals & Tasks Modal */}
        <TasksPanel isOpen={isTasksOpen} onClose={() => setIsTasksOpen(false)} />
          </>
        )}
        </AuthProvider>
      </body>
    </html>
  );
}
