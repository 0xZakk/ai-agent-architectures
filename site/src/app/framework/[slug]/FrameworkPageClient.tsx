'use client';

import MarkdownRenderer from '@/components/MarkdownRenderer';
import TableOfContents from '@/components/TableOfContents';
import type { Framework } from '@/lib/frameworks';

interface Props {
  framework: Framework;
  content: string;
  headings: { id: string; text: string; level: number }[];
}

export default function FrameworkPageClient({ framework, content, headings }: Props) {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0 max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{framework.icon}</span>
          <div>
            <h1 className="text-2xl font-bold font-serif text-[var(--color-text-bright)]">{framework.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-xs px-2 py-0.5 rounded-full border"
                style={{ color: `var(--color-${framework.colorVar})`, borderColor: `var(--color-${framework.colorVar})`, borderWidth: '1px', opacity: 0.8 }}
              >
                {framework.language}
              </span>
              <span className="text-sm text-[var(--color-text-muted)]">{framework.tagline}</span>
            </div>
          </div>
        </div>
        <MarkdownRenderer content={content} />
      </div>
      <TableOfContents headings={headings} />
    </div>
  );
}
