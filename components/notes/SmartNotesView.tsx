'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BookOpen,
  Search,
  RotateCw,
  Play,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  FileText,
  Copy,
  Check,
  Download,
  Star,
  Bookmark,
  ExternalLink,
  ChevronRight,
  Columns,
  LayoutGrid,
  Zap,
  HelpCircle,
  Hash,
  Terminal,
} from 'lucide-react';
import { formatTime } from '@/lib/utils';

export interface SmartNoteData {
  id: string;
  video_id: string;
  segment_id?: string | null;
  section_type:
    | 'overview'
    | 'key_concepts'
    | 'definitions'
    | 'core_explanations'
    | 'examples'
    | 'takeaways'
    | 'common_mistakes'
    | 'quick_revision';
  title: string;
  content: string;
  source_start_seconds?: number | null;
  source_end_seconds?: number | null;
  order_index: number;
  segment?: {
    id: string;
    order_index: number;
    title: string;
    start_seconds: number;
    end_seconds: number;
  } | null;
}

interface SmartNotesViewProps {
  videoId: string;
  videoTitle: string;
}

/**
 * Parses and renders inline markdown tokens: bold **text**, inline `code`, and plain text.
 */
function renderInlineMarkdown(text: string) {
  // Regex to match **bold** or `code`
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-extrabold text-[#111218]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded-md bg-[#EAE6DB] border border-[#111218]/30 font-mono text-[11px] text-[#111218] font-bold"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

/**
 * Lightweight, robust neo-brutalist Markdown Renderer.
 * Accurately formats headers, bullet lists, numbered steps, code blocks, and blockquotes.
 */
function FormattedNoteContent({ content }: { content: string }) {
  // Check if content is a JSON array string (used for takeaways / pitfalls)
  let jsonItems: string[] | null = null;
  if (content.trim().startsWith('[') && content.trim().endsWith(']')) {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
        jsonItems = parsed;
      }
    } catch {
      jsonItems = null;
    }
  }

  if (jsonItems) {
    return (
      <ul className="space-y-2 text-xs font-medium text-[#111218]">
        {jsonItems.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#111218] mt-1.5 flex-shrink-0" />
            <div className="leading-relaxed flex-1">{renderInlineMarkdown(item)}</div>
          </li>
        ))}
      </ul>
    );
  }

  // Parse lines for markdown elements
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();

    // Fenced Code Block handling
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // Close code block
        const codeText = codeBlockLines.join('\n');
        elements.push(
          <div key={`code-${idx}`} className="my-2.5 rounded-xl bg-[#111218] p-3 text-slate-100 font-mono text-xs border border-[#111218]">
            <pre className="overflow-x-auto">{codeText}</pre>
          </div>
        );
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockLines.push(rawLine);
      return;
    }

    if (!line) {
      elements.push(<div key={`empty-${idx}`} className="h-1.5" />);
      return;
    }

    // Markdown Headers (### Header)
    if (line.startsWith('### ') || line.startsWith('## ') || line.startsWith('# ')) {
      const headerText = line.replace(/^#+\s*/, '');
      elements.push(
        <h5
          key={`h-${idx}`}
          className="text-xs font-black uppercase text-[#111218] tracking-wider pt-2 pb-1 font-display flex items-center gap-1.5"
        >
          <Hash className="w-3 h-3 text-[#8ECC24]" />
          <span>{headerText}</span>
        </h5>
      );
      return;
    }

    // Bullet points (- or * )
    if (/^[-*]\s+/.test(line)) {
      const bulletText = line.replace(/^[-*]\s+/, '');
      elements.push(
        <div key={`b-${idx}`} className="flex items-start gap-2 text-xs text-[#21232C] font-medium leading-relaxed my-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#111218] mt-1.5 flex-shrink-0" />
          <div className="flex-1">{renderInlineMarkdown(bulletText)}</div>
        </div>
      );
      return;
    }

    // Numbered steps (1. 2. )
    if (/^\d+\.\s+/.test(line)) {
      const stepMatch = line.match(/^(\d+)\.\s+(.*)$/);
      const stepNum = stepMatch ? stepMatch[1] : '1';
      const stepText = stepMatch ? stepMatch[2] : line;
      elements.push(
        <div key={`num-${idx}`} className="flex items-start gap-2.5 text-xs text-[#21232C] font-medium leading-relaxed my-1">
          <span className="w-4 h-4 rounded-full bg-[#111218] text-[#B8FF3D] text-[10px] font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
            {stepNum}
          </span>
          <div className="flex-1">{renderInlineMarkdown(stepText)}</div>
        </div>
      );
      return;
    }

    // Blockquote (> )
    if (line.startsWith('>')) {
      const quoteText = line.replace(/^>\s*/, '');
      elements.push(
        <blockquote
          key={`q-${idx}`}
          className="border-l-4 border-[#B8FF3D] bg-[#F5F3EC]/80 pl-3 py-1.5 my-2 rounded-r-xl text-xs font-semibold text-[#111218] italic"
        >
          {renderInlineMarkdown(quoteText)}
        </blockquote>
      );
      return;
    }

    // Standard Paragraph
    elements.push(
      <p key={`p-${idx}`} className="text-xs text-[#21232C] font-medium leading-relaxed my-1">
        {renderInlineMarkdown(line)}
      </p>
    );
  });

  return <div className="space-y-0.5">{elements}</div>;
}

export function SmartNotesView({ videoId, videoTitle }: SmartNotesViewProps) {
  const [notes, setNotes] = useState<SmartNoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'cornell' | 'cheatsheet'>('cards');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [starredNoteIds, setStarredNoteIds] = useState<Set<string>>(new Set());

  // Load Starred notes from localStorage
  useEffect(() => {
    if (!videoId) return;
    try {
      const saved = localStorage.getItem(`saras_starred_notes_${videoId}`);
      if (saved) {
        setStarredNoteIds(new Set(JSON.parse(saved)));
      }
    } catch {
      // LocalStorage access non-fatal
    }
  }, [videoId]);

  const toggleStar = (noteId: string) => {
    setStarredNoteIds((prev) => {
      const next = new Set(prev);
      if (next.has(noteId)) {
        next.delete(noteId);
      } else {
        next.add(noteId);
      }
      try {
        localStorage.setItem(`saras_starred_notes_${videoId}`, JSON.stringify(Array.from(next)));
      } catch {
        // silent
      }
      return next;
    });
  };

  const fetchNotes = useCallback(async (forceRegenerate = false) => {
    try {
      if (forceRegenerate) {
        setIsRegenerating(true);
        const res = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId }),
        });
        if (res.ok) {
          const data = await res.json();
          setNotes(data.notes || []);
        }
      } else {
        setLoading(true);
        const res = await fetch(`/api/notes?videoId=${videoId}`);
        if (res.ok) {
          const data = await res.json();
          setNotes(data.notes || []);
        }
      }
    } catch (e) {
      console.error('Failed to load smart notes:', e);
    } finally {
      setLoading(false);
      setIsRegenerating(false);
    }
  }, [videoId]);

  useEffect(() => {
    if (videoId) fetchNotes();
  }, [videoId, fetchNotes]);

  // Clickable timestamp seek
  const handleSeek = (seconds?: number | null) => {
    if (seconds == null || isNaN(seconds)) return;
    window.dispatchEvent(
      new CustomEvent('seek-video-player', { detail: { seconds } })
    );
  };

  // Copy individual note
  const copyNoteText = (note: SmartNoteData) => {
    const textToCopy = `### ${note.title}\n\n${note.content}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Export all notes as complete Markdown
  const exportAllAsMarkdown = useCallback(() => {
    if (notes.length === 0) return;

    let md = `# Smart Study Notes: ${videoTitle}\n`;
    md += `*Generated by Saras AI Master Study Synthesizer*\n\n`;

    const sectionTitles: Record<string, string> = {
      overview: 'Executive Overview',
      key_concepts: 'Core Key Concepts',
      definitions: 'Technical Glossary & Definitions',
      core_explanations: 'Mechanisms & Sequential Architectures',
      examples: 'Concrete Examples & Analogies',
      takeaways: 'Core Rules of Thumb & Best Practices',
      common_mistakes: 'Common Pitfalls & Antipatterns',
      quick_revision: 'High-Density Quick Revision Sheet',
    };

    const grouped: Record<string, SmartNoteData[]> = {};
    for (const note of notes) {
      if (!grouped[note.section_type]) grouped[note.section_type] = [];
      grouped[note.section_type].push(note);
    }

    const order = [
      'overview',
      'key_concepts',
      'definitions',
      'core_explanations',
      'examples',
      'takeaways',
      'common_mistakes',
      'quick_revision',
    ];

    for (const sec of order) {
      const items = grouped[sec];
      if (!items || items.length === 0) continue;

      md += `## ${sectionTitles[sec] || sec.toUpperCase()}\n\n`;
      for (const item of items) {
        const timeStr = item.source_start_seconds != null ? ` [${formatTime(item.source_start_seconds)}]` : '';
        md += `### ${item.title}${timeStr}\n\n`;

        if (item.content.startsWith('[') && item.content.endsWith(']')) {
          try {
            const arr = JSON.parse(item.content);
            for (const a of arr) {
              md += `- ${a}\n`;
            }
            md += '\n';
          } catch {
            md += `${item.content}\n\n`;
          }
        } else {
          md += `${item.content}\n\n`;
        }
      }
    }

    navigator.clipboard.writeText(md);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  }, [notes, videoTitle]);

  // Download .md file
  const downloadMarkdownFile = () => {
    if (notes.length === 0) return;
    const sectionTitles: Record<string, string> = {
      overview: 'Executive Overview',
      key_concepts: 'Core Key Concepts',
      definitions: 'Technical Glossary & Definitions',
      core_explanations: 'Mechanisms & Sequential Architectures',
      examples: 'Concrete Examples & Analogies',
      takeaways: 'Core Rules of Thumb & Best Practices',
      common_mistakes: 'Common Pitfalls & Antipatterns',
      quick_revision: 'High-Density Quick Revision Sheet',
    };

    let md = `# Smart Study Notes: ${videoTitle}\n`;
    md += `*Generated by Saras AI Master Study Synthesizer*\n\n`;

    for (const note of notes) {
      const timeStr = note.source_start_seconds != null ? ` [${formatTime(note.source_start_seconds)}]` : '';
      md += `## ${note.title}${timeStr}\n`;
      md += `*Section: ${sectionTitles[note.section_type] || note.section_type}*\n\n`;
      md += `${note.content}\n\n---\n\n`;
    }

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${videoTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_smart_notes.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Group notes by section type
  const overviewNotes = useMemo(() => notes.filter((n) => n.section_type === 'overview'), [notes]);
  const keyConceptNotes = useMemo(() => notes.filter((n) => n.section_type === 'key_concepts'), [notes]);
  const definitionNotes = useMemo(() => notes.filter((n) => n.section_type === 'definitions'), [notes]);
  const explanationNotes = useMemo(() => notes.filter((n) => n.section_type === 'core_explanations'), [notes]);
  const exampleNotes = useMemo(() => notes.filter((n) => n.section_type === 'examples'), [notes]);
  const takeawayNotes = useMemo(() => notes.filter((n) => n.section_type === 'takeaways'), [notes]);
  const commonMistakeNotes = useMemo(() => notes.filter((n) => n.section_type === 'common_mistakes'), [notes]);
  const quickRevisionNotes = useMemo(() => notes.filter((n) => n.section_type === 'quick_revision'), [notes]);
  const starredNotes = useMemo(() => notes.filter((n) => starredNoteIds.has(n.id)), [notes, starredNoteIds]);

  // Filter notes by search query and selected section
  const filteredNotes = useMemo(() => {
    let base = notes;
    if (selectedSection === 'starred') {
      base = starredNotes;
    } else if (selectedSection !== 'all') {
      base = notes.filter((n) => n.section_type === selectedSection);
    }

    if (!searchQuery.trim()) return base;
    const q = searchQuery.toLowerCase();
    return base.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.section_type.toLowerCase().includes(q)
    );
  }, [notes, selectedSection, searchQuery, starredNotes]);

  if (loading) {
    return (
      <div className="bg-[#FFFDF7] border-2 border-[#111218] rounded-3xl p-10 shadow-neo text-center space-y-4 my-4">
        <div className="w-14 h-14 rounded-2xl bg-[#B8FF3D] border-2 border-[#111218] flex items-center justify-center text-[#111218] mx-auto shadow-neo-sm">
          <RotateCw className="w-7 h-7 animate-spin" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-extrabold text-[#111218] font-display uppercase tracking-tight">
            Synthesizing Master Smart Notes...
          </h3>
          <p className="text-xs text-[#636573] max-w-md mx-auto font-medium">
            Extracting deep conceptual breakdowns, rigorous terminology, step-by-step architectures, and high-yield revision sheets.
          </p>
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="bg-[#FFFDF7] border-2 border-[#111218] rounded-3xl p-10 shadow-neo text-center space-y-4 my-4">
        <div className="w-14 h-14 rounded-2xl bg-[#E9DFFF] border-2 border-[#111218] flex items-center justify-center text-[#111218] mx-auto shadow-neo-sm">
          <FileText className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-extrabold text-[#111218] font-display uppercase">
            No Smart Notes Available Yet
          </h3>
          <p className="text-xs text-[#636573] max-w-md mx-auto font-medium">
            Generate persistent, high-yield academic study notes directly from this lesson&rsquo;s content.
          </p>
        </div>
        <button
          onClick={() => fetchNotes(true)}
          className="neo-btn-lime px-5 py-2.5 text-xs font-bold font-display inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Master Smart Notes</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar: Mode Switcher + Study Utilities + Regenerate */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b-2 border-[#111218]">
        {/* Left: View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F5F3EC] border-2 border-[#111218] rounded-2xl shrink-0">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-display flex items-center gap-1.5 transition-all ${
              viewMode === 'cards'
                ? 'bg-[#B8FF3D] text-[#111218] border-2 border-[#111218] shadow-neo-sm'
                : 'text-[#636573] hover:text-[#111218]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Structured Cards</span>
          </button>

          <button
            onClick={() => setViewMode('cornell')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-display flex items-center gap-1.5 transition-all ${
              viewMode === 'cornell'
                ? 'bg-[#B8FF3D] text-[#111218] border-2 border-[#111218] shadow-neo-sm'
                : 'text-[#636573] hover:text-[#111218]'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Cornell System</span>
          </button>

          <button
            onClick={() => setViewMode('cheatsheet')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-display flex items-center gap-1.5 transition-all ${
              viewMode === 'cheatsheet'
                ? 'bg-[#B8FF3D] text-[#111218] border-2 border-[#111218] shadow-neo-sm'
                : 'text-[#636573] hover:text-[#111218]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Cheat Sheet</span>
          </button>
        </div>

        {/* Right: Search + Export Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#636573]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, terms, code..."
              className="w-full pl-9 pr-3 py-2 bg-[#F5F3EC] border-2 border-[#111218] rounded-xl text-xs font-medium focus:outline-none focus:bg-[#FFFDF7] transition-colors"
            />
          </div>

          {/* Copy All as Markdown (Notion / Obsidian ready) */}
          <button
            onClick={exportAllAsMarkdown}
            className="neo-btn-outline px-3 py-2 text-xs font-bold font-display flex items-center gap-1.5"
            title="Copy all notes formatted as Markdown for Notion or Obsidian"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'Copied!' : 'Copy Markdown'}</span>
          </button>

          {/* Download .md */}
          <button
            onClick={downloadMarkdownFile}
            className="neo-btn-outline px-2.5 py-2 text-xs font-bold font-display flex items-center gap-1"
            title="Download Notes (.md file)"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Force Regenerate */}
          <button
            onClick={() => fetchNotes(true)}
            disabled={isRegenerating}
            className="neo-btn-outline px-3 py-2 text-xs font-bold font-display flex items-center gap-1.5 disabled:opacity-50"
            title="Regenerate notes strictly from video transcript"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? 'Synthesizing...' : 'Regenerate'}</span>
          </button>
        </div>
      </div>

      {/* 2. Section Navigation Pills (in Cards View) */}
      {viewMode === 'cards' && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { key: 'all', label: 'All Sections', count: notes.length },
            { key: 'overview', label: 'Executive Overview', count: overviewNotes.length },
            { key: 'key_concepts', label: 'Key Concepts', count: keyConceptNotes.length },
            { key: 'definitions', label: 'Glossary & Terms', count: definitionNotes.length },
            { key: 'core_explanations', label: 'Mechanisms & Workflows', count: explanationNotes.length },
            { key: 'examples', label: 'Examples & Analogies', count: exampleNotes.length },
            { key: 'takeaways', label: 'Rules of Thumb', count: takeawayNotes.length },
            { key: 'common_mistakes', label: 'Pitfalls & Traps', count: commonMistakeNotes.length },
            { key: 'quick_revision', label: 'Quick Revision', count: quickRevisionNotes.length },
            { key: 'starred', label: '★ Starred', count: starredNotes.length },
          ]
            .filter((tab) => tab.key === 'all' || tab.count > 0 || (tab.key === 'starred' && starredNotes.length > 0))
            .map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedSection(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold whitespace-nowrap transition-all ${
                  selectedSection === tab.key
                    ? 'bg-[#B8FF3D] text-[#111218] border-2 border-[#111218] shadow-neo-sm'
                    : 'text-[#636573] hover:text-[#111218] hover:bg-[#F5F3EC]'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
        </div>
      )}

      {/* Search Result Banner */}
      {searchQuery.trim() && (
        <div className="p-3 bg-[#DCEEFF] border-2 border-[#111218] rounded-xl flex items-center justify-between text-xs font-bold">
          <span>Found {filteredNotes.length} matching notes for &ldquo;{searchQuery}&rdquo;</span>
          <button onClick={() => setSearchQuery('')} className="underline hover:text-black">
            Clear Search
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODE A: STRUCTURED CARDS VIEW
      ───────────────────────────────────────────────────────────── */}
      {viewMode === 'cards' && (
        <div className="space-y-8">
          {/* SECTION A: Overview */}
          {(selectedSection === 'all' || selectedSection === 'overview') &&
            overviewNotes.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="badge-lime px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                    Executive Overview
                  </span>
                  <h3 className="text-sm font-extrabold text-[#111218] font-display uppercase">
                    Core Learning Thesis & Foundations
                  </h3>
                </div>

                {overviewNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-6 rounded-3xl bg-[#FFFDF7] border-2 border-[#111218] shadow-neo space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between border-b border-[#111218]/10 pb-2">
                      <h4 className="text-xs font-black font-display uppercase text-[#111218] tracking-tight">
                        {note.title}
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => copyNoteText(note)}
                          className="p-1 rounded-lg hover:bg-[#F5F3EC] text-[#636573] hover:text-[#111218] transition-colors"
                          title="Copy Section"
                        >
                          {copiedId === note.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => toggleStar(note.id)}
                          className={`p-1 rounded-lg transition-colors ${
                            starredNoteIds.has(note.id) ? 'text-amber-500 fill-amber-500' : 'text-[#636573] hover:text-[#111218]'
                          }`}
                          title="Star note"
                        >
                          <Star className={`w-3.5 h-3.5 ${starredNoteIds.has(note.id) ? 'fill-amber-400' : ''}`} />
                        </button>
                      </div>
                    </div>
                    <FormattedNoteContent content={note.content} />
                  </div>
                ))}
              </section>
            )}

          {/* SECTION B: Key Concepts */}
          {(selectedSection === 'all' || selectedSection === 'key_concepts') &&
            keyConceptNotes.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="badge-black px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    Core Concepts
                  </span>
                  <h3 className="text-sm font-extrabold text-[#111218] font-display uppercase">
                    Master Conceptual Breakdown ({keyConceptNotes.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {keyConceptNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-5 rounded-2xl bg-[#FFFDF7] border-2 border-[#111218] shadow-neo flex flex-col justify-between space-y-3 group hover:-translate-y-0.5 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 border-b border-[#111218]/10 pb-2">
                          <h4 className="text-xs font-black font-display text-[#111218] uppercase tracking-tight">
                            {note.title}
                          </h4>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {note.source_start_seconds != null && (
                              <button
                                onClick={() => handleSeek(note.source_start_seconds)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#B8FF3D] hover:bg-[#A6F024] border border-[#111218] text-[10px] font-mono font-bold text-[#111218] transition-colors"
                                title={`Jump to ${formatTime(note.source_start_seconds)}`}
                              >
                                <Play className="w-2.5 h-2.5 fill-[#111218]" />
                                <span>{formatTime(note.source_start_seconds)}</span>
                              </button>
                            )}
                            <button
                              onClick={() => toggleStar(note.id)}
                              className={`p-1 rounded-md transition-colors ${
                                starredNoteIds.has(note.id) ? 'text-amber-500 fill-amber-500' : 'text-[#636573] hover:text-[#111218]'
                              }`}
                            >
                              <Star className={`w-3.5 h-3.5 ${starredNoteIds.has(note.id) ? 'fill-amber-400' : ''}`} />
                            </button>
                            <button
                              onClick={() => copyNoteText(note)}
                              className="p-1 rounded-md text-[#636573] hover:text-[#111218]"
                            >
                              {copiedId === note.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        <FormattedNoteContent content={note.content} />
                      </div>

                      {note.segment && (
                        <div className="pt-2 border-t border-[#111218]/10 flex items-center justify-between text-[10px] text-[#636573] font-mono">
                          <span>Chapter {note.segment.order_index + 1}: {note.segment.title}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

          {/* SECTION C: Definitions & Glossary */}
          {(selectedSection === 'all' || selectedSection === 'definitions') &&
            definitionNotes.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="badge-black px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#E9DFFF]">
                    Glossary
                  </span>
                  <h3 className="text-sm font-extrabold text-[#111218] font-display uppercase">
                    Definitive Technical Glossary & Terminology ({definitionNotes.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {definitionNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-2xl bg-[#F5F3EC] border-2 border-[#111218] shadow-neo-sm space-y-1.5 group hover:bg-[#FFFDF7] transition-all"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-black font-display uppercase text-[#111218] flex items-center gap-1.5">
                          <span className="text-[#8ECC24]">✦</span> {note.title}
                        </span>
                        <div className="flex items-center gap-1">
                          {note.source_start_seconds != null && (
                            <button
                              onClick={() => handleSeek(note.source_start_seconds)}
                              className="text-[10px] font-mono font-bold text-[#111218] underline hover:text-[#8ECC24]"
                            >
                              {formatTime(note.source_start_seconds)} →
                            </button>
                          )}
                          <button
                            onClick={() => toggleStar(note.id)}
                            className="p-0.5 text-[#636573] hover:text-[#111218]"
                          >
                            <Star className={`w-3 h-3 ${starredNoteIds.has(note.id) ? 'text-amber-500 fill-amber-400' : ''}`} />
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-[#21232C] font-medium leading-relaxed">
                        <FormattedNoteContent content={note.content} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          {/* SECTION D: Core Mechanisms & Processes */}
          {(selectedSection === 'all' || selectedSection === 'core_explanations') &&
            explanationNotes.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="badge-black px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#DCEEFF]">
                    Mechanisms
                  </span>
                  <h3 className="text-sm font-extrabold text-[#111218] font-display uppercase">
                    Step-by-Step System Workflows & Architectures
                  </h3>
                </div>

                <div className="space-y-3.5">
                  {explanationNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-5 rounded-2xl bg-[#FFFDF7] border-2 border-[#111218] shadow-neo space-y-2.5"
                    >
                      <div className="flex items-center justify-between border-b border-[#111218]/10 pb-2">
                        <h4 className="text-xs font-black font-display text-[#111218] uppercase tracking-tight">
                          {note.title}
                        </h4>
                        <div className="flex items-center gap-1.5">
                          {note.source_start_seconds != null && (
                            <button
                              onClick={() => handleSeek(note.source_start_seconds)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#DCEEFF] hover:bg-[#C2E3FF] border border-[#111218] text-[10px] font-mono font-bold text-[#111218]"
                            >
                              <Play className="w-2.5 h-2.5 fill-[#111218]" />
                              <span>{formatTime(note.source_start_seconds)}</span>
                            </button>
                          )}
                          <button
                            onClick={() => copyNoteText(note)}
                            className="p-1 rounded-md text-[#636573] hover:text-[#111218]"
                          >
                            {copiedId === note.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <FormattedNoteContent content={note.content} />
                    </div>
                  ))}
                </div>
              </section>
            )}

          {/* SECTION E: Concrete Examples & Analogies */}
          {(selectedSection === 'all' || selectedSection === 'examples') &&
            exampleNotes.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="badge-black px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#DDF6BD]">
                    Case Studies
                  </span>
                  <h3 className="text-sm font-extrabold text-[#111218] font-display uppercase">
                    Real-World Implementation Examples & Analogies
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {exampleNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-2xl bg-[#DDF6BD] border-2 border-[#111218] shadow-neo-sm space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black font-display uppercase text-[#111218]">
                          {note.title}
                        </h4>
                        {note.source_start_seconds != null && (
                          <button
                            onClick={() => handleSeek(note.source_start_seconds)}
                            className="text-[10px] font-mono font-bold text-[#111218] underline"
                          >
                            {formatTime(note.source_start_seconds)} →
                          </button>
                        )}
                      </div>
                      <div className="text-xs text-[#21232C] font-medium leading-relaxed">
                        <FormattedNoteContent content={note.content} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          {/* SECTION F: Rules of Thumb & Best Practices */}
          {(selectedSection === 'all' || selectedSection === 'takeaways') &&
            takeawayNotes.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="badge-lime px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                    Best Practices
                  </span>
                  <h3 className="text-sm font-extrabold text-[#111218] font-display uppercase">
                    Core Architectural Rules of Thumb
                  </h3>
                </div>

                {takeawayNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-5 rounded-2xl bg-[#FFFDF7] border-2 border-[#111218] shadow-neo space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-[#111218]/10 pb-2">
                      <h4 className="text-xs font-black font-display uppercase text-[#111218]">
                        {note.title}
                      </h4>
                      <button
                        onClick={() => copyNoteText(note)}
                        className="p-1 rounded-md text-[#636573] hover:text-[#111218]"
                      >
                        {copiedId === note.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <FormattedNoteContent content={note.content} />
                  </div>
                ))}
              </section>
            )}

          {/* SECTION G: Common Mistakes & Pitfalls */}
          {(selectedSection === 'all' || selectedSection === 'common_mistakes') &&
            commonMistakeNotes.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="badge-black px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#FFD1C7] text-red-950">
                    Antipatterns
                  </span>
                  <h3 className="text-sm font-extrabold text-[#111218] font-display uppercase">
                    Common Pitfalls & Traps to Avoid
                  </h3>
                </div>

                {commonMistakeNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-5 rounded-2xl bg-[#FFFDF7] border-2 border-red-950/40 shadow-neo space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-red-950/10 pb-2">
                      <h4 className="text-xs font-black font-display uppercase text-red-950 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span>{note.title}</span>
                      </h4>
                      <button
                        onClick={() => copyNoteText(note)}
                        className="p-1 rounded-md text-[#636573] hover:text-[#111218]"
                      >
                        {copiedId === note.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <FormattedNoteContent content={note.content} />
                  </div>
                ))}
              </section>
            )}

          {/* SECTION H: Quick Revision Sheet */}
          {(selectedSection === 'all' || selectedSection === 'quick_revision') &&
            quickRevisionNotes.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="badge-lime px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                    Cram Sheet
                  </span>
                  <h3 className="text-sm font-extrabold text-[#111218] font-display uppercase">
                    High-Density Quick Revision Sheet
                  </h3>
                </div>

                {quickRevisionNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-6 rounded-3xl bg-[#111218] text-white border-2 border-[#111218] shadow-neo-lg space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#B8FF3D]" />
                        <h4 className="text-xs font-black font-display uppercase tracking-wider text-[#B8FF3D]">
                          {note.title}
                        </h4>
                      </div>
                      <button
                        onClick={() => copyNoteText(note)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Copy Revision Sheet"
                      >
                        {copiedId === note.id ? <Check className="w-3.5 h-3.5 text-[#B8FF3D]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="text-slate-200 text-xs font-medium leading-relaxed">
                      <FormattedNoteContent content={note.content} />
                    </div>
                  </div>
                ))}
              </section>
            )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODE B: CORNELL NOTE-TAKING SYSTEM VIEW
      ───────────────────────────────────────────────────────────── */}
      {viewMode === 'cornell' && (
        <div className="bg-[#FFFDF7] border-2 border-[#111218] rounded-3xl p-6 sm:p-8 shadow-neo space-y-6">
          {/* Cornell Header */}
          <div className="border-b-2 border-[#111218] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#636573] font-mono">
                CORNELL METHOD STUDY SYSTEM
              </span>
              <h2 className="text-lg font-black font-display uppercase text-[#111218]">
                {videoTitle}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#636573]">
              <span className="px-2.5 py-1 rounded-lg bg-[#EAE6DB] border border-[#111218]/30">
                {notes.length} Study Units
              </span>
            </div>
          </div>

          {/* 2-Column Cornell Body */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[400px]">
            {/* Left 4 Cols: Cues, Terms & Recall Prompts */}
            <div className="md:col-span-4 border-r-0 md:border-r-2 border-[#111218]/20 pr-0 md:pr-6 space-y-4">
              <div className="flex items-center gap-1.5 pb-2 border-b border-[#111218]/15">
                <Bookmark className="w-3.5 h-3.5 text-[#8ECC24]" />
                <h4 className="text-xs font-black uppercase tracking-wider font-display text-[#111218]">
                  Cues & Recall Prompts
                </h4>
              </div>

              <div className="space-y-3">
                {notes.map((note) => (
                  <div
                    key={`cue-${note.id}`}
                    className="p-3 rounded-xl bg-[#F5F3EC] border border-[#111218]/30 text-xs space-y-1 hover:border-[#111218] transition-all"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-[#111218] font-display uppercase">
                        {note.title}
                      </span>
                      {note.source_start_seconds != null && (
                        <button
                          onClick={() => handleSeek(note.source_start_seconds)}
                          className="text-[10px] font-mono font-bold text-[#8ECC24] hover:underline"
                        >
                          {formatTime(note.source_start_seconds)}
                        </button>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-[#636573] uppercase tracking-wider block">
                      {note.section_type.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 8 Cols: Detailed Study Notes */}
            <div className="md:col-span-8 space-y-5">
              <div className="flex items-center gap-1.5 pb-2 border-b border-[#111218]/15">
                <FileText className="w-3.5 h-3.5 text-[#8ECC24]" />
                <h4 className="text-xs font-black uppercase tracking-wider font-display text-[#111218]">
                  Detailed Notes & Mechanistic Explanations
                </h4>
              </div>

              <div className="space-y-4">
                {notes
                  .filter((n) => n.section_type !== 'overview' && n.section_type !== 'quick_revision')
                  .map((note) => (
                    <div
                      key={`body-${note.id}`}
                      className="p-4 rounded-2xl bg-[#FFFDF7] border-2 border-[#111218] shadow-neo-sm space-y-2"
                    >
                      <div className="flex items-center justify-between border-b border-[#111218]/10 pb-1.5">
                        <span className="text-xs font-black font-display uppercase text-[#111218]">
                          {note.title}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {note.source_start_seconds != null && (
                            <button
                              onClick={() => handleSeek(note.source_start_seconds)}
                              className="text-[10px] font-mono font-bold bg-[#B8FF3D] px-2 py-0.5 rounded border border-[#111218]"
                            >
                              ▶ {formatTime(note.source_start_seconds)}
                            </button>
                          )}
                          <button
                            onClick={() => copyNoteText(note)}
                            className="p-1 rounded text-[#636573] hover:text-[#111218]"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <FormattedNoteContent content={note.content} />
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Bottom Row: Cornell Summary Box */}
          <div className="pt-4 border-t-2 border-[#111218] space-y-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#8ECC24]" />
              <h4 className="text-xs font-black uppercase tracking-wider font-display text-[#111218]">
                Cornell Synthesis & 2-Minute Summary
              </h4>
            </div>

            {quickRevisionNotes.length > 0 ? (
              <div className="p-4 rounded-2xl bg-[#E9DFFF] border-2 border-[#111218] text-xs font-medium text-[#111218] leading-relaxed">
                <FormattedNoteContent content={quickRevisionNotes[0].content} />
              </div>
            ) : overviewNotes.length > 0 ? (
              <div className="p-4 rounded-2xl bg-[#E9DFFF] border-2 border-[#111218] text-xs font-medium text-[#111218] leading-relaxed">
                <FormattedNoteContent content={overviewNotes[0].content} />
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODE C: CHEAT SHEET / RAPID REVISION MODE
      ───────────────────────────────────────────────────────────── */}
      {viewMode === 'cheatsheet' && (
        <div className="bg-[#FFFDF7] border-2 border-[#111218] rounded-3xl p-6 sm:p-8 shadow-neo space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#111218] pb-4">
            <div>
              <span className="badge-lime px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                Ultra-Dense Cram Sheet
              </span>
              <h3 className="text-base sm:text-lg font-black font-display uppercase text-[#111218] mt-1">
                {videoTitle} — Fast Track Reference
              </h3>
            </div>
            <button
              onClick={exportAllAsMarkdown}
              className="neo-btn-primary px-3 py-1.5 text-xs font-bold font-display flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5 text-[#B8FF3D]" />
              <span>Copy Sheet</span>
            </button>
          </div>

          {/* Quick Revision Header Card */}
          {quickRevisionNotes.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#111218] text-white border-2 border-[#111218] shadow-neo space-y-2">
              <h4 className="text-xs font-black uppercase font-display text-[#B8FF3D] flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                <span>Lecture Core Recap</span>
              </h4>
              <FormattedNoteContent content={quickRevisionNotes[0].content} />
            </div>
          )}

          {/* Rapid Glossary Grid */}
          {definitionNotes.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider font-display text-[#111218]">
                Terminology Cheatsheet
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {definitionNotes.map((d) => (
                  <div key={d.id} className="p-3 rounded-xl bg-[#F5F3EC] border-2 border-[#111218] text-xs space-y-1">
                    <span className="font-extrabold uppercase text-[#111218] block">✦ {d.title}</span>
                    <p className="text-[11px] text-[#636573] leading-snug">{d.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Takeaways & Pitfalls 2-Col Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {takeawayNotes.length > 0 && (
              <div className="p-5 rounded-2xl bg-[#FFFDF7] border-2 border-[#111218] shadow-neo-sm space-y-2.5">
                <h4 className="text-xs font-black uppercase font-display text-[#111218] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8ECC24]" />
                  <span>Golden Rules of Thumb</span>
                </h4>
                <FormattedNoteContent content={takeawayNotes[0].content} />
              </div>
            )}

            {commonMistakeNotes.length > 0 && (
              <div className="p-5 rounded-2xl bg-[#FFFDF7] border-2 border-red-950/40 shadow-neo-sm space-y-2.5">
                <h4 className="text-xs font-black uppercase font-display text-red-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Traps & Antipatterns</span>
                </h4>
                <FormattedNoteContent content={commonMistakeNotes[0].content} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
