'use client';

import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { VertexGdnaCourseSection } from '@/components/course/VertexGdnaCourseSection';

export default function VertexGdnaCoursePage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <NextLink
          href="/discover"
          className="inline-flex items-center gap-2 text-xs font-bold font-display uppercase tracking-wider text-[#111218] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </NextLink>

        <div className="flex items-center gap-2">
          <span className="badge-lime px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider font-display">
            Google Cloud & Vertex AI Track
          </span>
        </div>
      </div>

      {/* Vertex GDNA Course Specialization Component */}
      <VertexGdnaCourseSection
        onLaunchVideo={(videoId) => router.push(`/video/${videoId}`)}
      />
    </div>
  );
}
