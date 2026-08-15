'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Zap,
  BookOpen,
  Play,
  Layers,
  ArrowRight,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Search,
  SlidersHorizontal,
  X,
  Flame,
  Brain,
  Cpu,
  Code2,
  Workflow,
} from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { MASTERY_THRESHOLDS, MasteryState } from '@/lib/services/ai';

export interface GraphNode {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category: string;
  mastery_score: number;
  mastery_state: MasteryState;
  exposure_count: number;
  correct_count: number;
  wrong_count: number;
  last_seen_at: string;
  source_videos: {
    id: string;
    title: string;
    channel: string;
    youtube_video_id: string;
    segment_title?: string;
    start_seconds?: number;
  }[];
  flashcards_count: number;
  quiz_count: number;
  // Dynamic layout coordinates
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string; // 'prerequisite' | 'related' | 'part_of' | 'subtopic'
  weight?: number;
}

interface KnowledgeGraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onSelectNode?: (node: GraphNode | null) => void;
  selectedNodeId?: string | null;
}

export function KnowledgeGraphCanvas({
  nodes,
  edges,
  onSelectNode,
  selectedNodeId,
}: KnowledgeGraphCanvasProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Transform & Viewport State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Compute Layout Positions (Force-directed organic grid layout)
  const layoutNodes = useMemo(() => {
    if (nodes.length === 0) return [];

    const width = 900;
    const height = 650;
    const padding = 120;

    // Group by category to cluster related concepts naturally
    const categories = Array.from(new Set(nodes.map((n) => n.category)));
    const catAngleStep = (2 * Math.PI) / (categories.length || 1);

    return nodes.map((node, idx) => {
      const catIdx = categories.indexOf(node.category);
      const angle = catIdx * catAngleStep + (idx % 4) * 0.45;
      const radius = 180 + (idx % 3) * 85;

      const cx = width / 2 + Math.cos(angle) * radius;
      const cy = height / 2 + Math.sin(angle) * radius * 0.85;

      return {
        ...node,
        x: Math.max(padding, Math.min(width - padding, cx)),
        y: Math.max(padding, Math.min(height - padding, cy)),
      };
    });
  }, [nodes]);

  // Find active node
  const activeNode = useMemo(() => {
    return layoutNodes.find((n) => n.id === selectedNodeId) || null;
  }, [layoutNodes, selectedNodeId]);

  // Connected nodes to selected / hovered node for Focus Mode
  const focusNodeId = selectedNodeId || hoveredNodeId;
  const connectedNodeIds = useMemo(() => {
    if (!focusNodeId) return null;
    const set = new Set<string>([focusNodeId]);
    for (const edge of edges) {
      if (edge.source === focusNodeId) set.add(edge.target);
      if (edge.target === focusNodeId) set.add(edge.source);
    }
    return set;
  }, [focusNodeId, edges]);

  // Map nodes by ID for fast edge lookup
  const nodeMap = useMemo(() => {
    const map = new Map<string, typeof layoutNodes[0]>();
    layoutNodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [layoutNodes]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.graph-node') || (e.target as HTMLElement).closest('.graph-controls')) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(2.0, z + 0.2));
  const handleZoomOut = () => setZoom((z) => Math.max(0.4, z - 0.2));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getNodeColor = (state: MasteryState) => {
    switch (state) {
      case 'MASTERED':
        return { bg: 'bg-[#B8FF3D]', badge: 'bg-[#111218] text-[#B8FF3D]', border: 'border-[#111218]' };
      case 'DEVELOPING':
        return { bg: 'bg-[#E9DFFF]', badge: 'bg-[#111218] text-white', border: 'border-[#111218]' };
      case 'WEAK':
        return { bg: 'bg-[#FFD1C7]', badge: 'bg-red-900 text-white', border: 'border-red-950' };
      default:
        return { bg: 'bg-[#FFFDF7]', badge: 'bg-[#EAE6DB] text-[#636573]', border: 'border-[#111218]/40' };
    }
  };

  return (
    <div className="relative w-full h-[680px] bg-[#F5F3EC] border-2 border-[#111218] rounded-3xl overflow-hidden shadow-neo-lg select-none">
      {/* 1. Interactive Graph Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`w-full h-full cursor-${isDragging ? 'grabbing' : 'grab'} relative overflow-hidden`}
      >
        <svg
          className="w-full h-full pointer-events-none absolute inset-0"
          viewBox="0 0 900 650"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          <defs>
            {/* Arrowhead marker for prerequisite edges */}
            <marker
              id="arrow-prereq"
              viewBox="0 0 10 10"
              refX="16"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#111218" />
            </marker>
          </defs>

          {/* Render Edges */}
          {edges.map((edge) => {
            const sourceNode = nodeMap.get(edge.source);
            const targetNode = nodeMap.get(edge.target);
            if (!sourceNode || !targetNode) return null;

            const isHighlighted =
              connectedNodeIds &&
              connectedNodeIds.has(edge.source) &&
              connectedNodeIds.has(edge.target);
            const isDimmed = connectedNodeIds && !isHighlighted;

            const isPrereq = edge.type === 'prerequisite';
            const isRelated = edge.type === 'related';

            return (
              <g key={edge.id} opacity={isDimmed ? 0.15 : 1} className="transition-opacity duration-300">
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={isHighlighted ? '#111218' : '#111218'}
                  strokeWidth={isHighlighted ? 2.5 : 1.5}
                  strokeDasharray={isRelated ? '5,5' : undefined}
                  markerEnd={isPrereq ? 'url(#arrow-prereq)' : undefined}
                />
              </g>
            );
          })}
        </svg>

        {/* Render HTML Node Cards */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          {layoutNodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isHovered = hoveredNodeId === node.id;
            const isDimmed = connectedNodeIds && !connectedNodeIds.has(node.id);
            const colors = getNodeColor(node.mastery_state);

            return (
              <div
                key={node.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNode?.(node);
                }}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`graph-node absolute pointer-events-auto cursor-pointer p-3 rounded-2xl border-2 transition-all duration-200 min-w-[140px] max-w-[180px] select-none ${
                  colors.bg
                } ${colors.border} ${
                  isSelected
                    ? 'ring-4 ring-[#111218] shadow-neo-lg scale-105 z-30'
                    : isHovered
                    ? 'shadow-neo-md scale-105 z-20'
                    : 'shadow-neo-sm z-10'
                } ${isDimmed ? 'opacity-25 grayscale-[0.5]' : 'opacity-100'}`}
              >
                {/* Node Top: Icon & Category */}
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#636573] truncate">
                    {node.category}
                  </span>
                  <span className="w-2 h-2 rounded-full border border-[#111218] bg-[#111218]" />
                </div>

                {/* Node Title */}
                <h4 className="text-xs font-black font-display uppercase tracking-tight text-[#111218] leading-snug line-clamp-2">
                  {node.name}
                </h4>

                {/* Node Bottom: Mastery Score Badge */}
                <div className="mt-2 pt-1.5 border-t border-[#111218]/15 flex items-center justify-between text-[10px] font-bold font-mono">
                  <span>{node.mastery_state === 'NOT_STUDIED' ? 'New' : `${node.mastery_score}%`}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${colors.badge}`}
                  >
                    {node.mastery_state}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Floating Viewport Controls */}
      <div className="graph-controls absolute bottom-4 left-4 flex items-center gap-1.5 p-1.5 bg-[#FFFDF7] border-2 border-[#111218] rounded-2xl shadow-neo z-20">
        <button
          onClick={handleZoomIn}
          className="p-1.5 rounded-lg text-[#111218] hover:bg-[#F5F3EC] transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1.5 rounded-lg text-[#111218] hover:bg-[#F5F3EC] transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-[#111218]/20" />
        <button
          onClick={handleReset}
          className="p-1.5 rounded-lg text-[#111218] hover:bg-[#F5F3EC] transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <span className="text-[10px] font-mono font-bold px-1 text-[#636573]">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* 3. Legend Indicator */}
      <div className="absolute top-4 left-4 hidden sm:flex items-center gap-2 p-2 bg-[#FFFDF7]/90 backdrop-blur-sm border-2 border-[#111218] rounded-xl text-[10px] font-bold font-display uppercase tracking-wider shadow-neo-sm z-20">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-[#B8FF3D] border border-[#111218]" /> Mastered
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-[#E9DFFF] border border-[#111218]" /> Developing
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-[#FFD1C7] border border-[#111218]" /> Needs Review
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-[#FFFDF7] border border-[#111218]" /> Not Studied
        </span>
      </div>

      {/* 4. Side Inspector Panel for Selected Concept */}
      {activeNode && (
        <div className="absolute top-0 right-0 w-full sm:w-96 h-full bg-[#FFFDF7] border-l-2 border-[#111218] p-6 shadow-neo-xl overflow-y-auto z-40 space-y-5 animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b-2 border-[#111218]">
            <div className="space-y-1">
              <span className="badge-lime px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
                {activeNode.category}
              </span>
              <h3 className="text-lg font-black font-display uppercase tracking-tight text-[#111218]">
                {activeNode.name}
              </h3>
            </div>
            <button
              onClick={() => onSelectNode?.(null)}
              className="p-1 rounded-lg text-[#111218] hover:bg-[#F5F3EC] border border-transparent hover:border-[#111218]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description */}
          {activeNode.description && (
            <p className="text-xs text-[#21232C] font-medium leading-relaxed bg-[#F5F3EC] p-3 rounded-xl border border-[#111218]">
              {activeNode.description}
            </p>
          )}

          {/* Mastery Statistics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-[#FFFDF7] border-2 border-[#111218] shadow-neo-sm space-y-1">
              <span className="text-[10px] font-bold font-mono uppercase text-[#636573]">
                Mastery Score
              </span>
              <div className="text-xl font-black font-display text-[#111218]">
                {activeNode.mastery_score}%
              </div>
              <span
                className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                  getNodeColor(activeNode.mastery_state).badge
                }`}
              >
                {activeNode.mastery_state}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#FFFDF7] border-2 border-[#111218] shadow-neo-sm space-y-1">
              <span className="text-[10px] font-bold font-mono uppercase text-[#636573]">
                Exposure & Drills
              </span>
              <div className="text-xl font-black font-display text-[#111218]">
                {activeNode.exposure_count}
              </div>
              <span className="text-[10px] text-[#636573] font-mono">
                {activeNode.correct_count} correct / {activeNode.wrong_count} wrong
              </span>
            </div>
          </div>

          {/* Source Videos List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold font-display uppercase tracking-wider text-[#111218]">
              Learned In Video Lessons ({activeNode.source_videos.length})
            </h4>

            {activeNode.source_videos.map((vid) => (
              <div
                key={vid.id}
                className="p-3 rounded-xl bg-[#F5F3EC] border-2 border-[#111218] space-y-2 text-xs"
              >
                <div>
                  <h5 className="font-extrabold font-display uppercase text-[#111218]">
                    {vid.title}
                  </h5>
                  {vid.segment_title && (
                    <p className="text-[10px] text-[#636573] font-medium mt-0.5">
                      Chapter: {vid.segment_title}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-[#111218]/10">
                  <NextLink
                    href={`/video/${vid.id}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold font-display text-[#111218] hover:underline"
                  >
                    <Play className="w-3 h-3 fill-[#111218]" />
                    <span>Watch Source</span>
                  </NextLink>

                  <NextLink
                    href={`/video/${vid.id}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold font-display text-[#636573] hover:underline ml-auto"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>Read Notes</span>
                  </NextLink>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Review / Practice CTA */}
          <div className="pt-2">
            <NextLink
              href="/flashcards"
              className="neo-btn-primary w-full py-2.5 text-xs font-bold font-display flex items-center justify-center gap-2"
            >
              <span>Practice This Concept In Flashcards</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B8FF3D]" />
            </NextLink>
          </div>
        </div>
      )}
    </div>
  );
}
