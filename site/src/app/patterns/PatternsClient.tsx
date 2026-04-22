'use client';

import MarkdownRenderer from '@/components/MarkdownRenderer';
import TableOfContents from '@/components/TableOfContents';

export default function PatternsClient({ content, headings }: { content: string; headings: { id: string; text: string; level: number }[] }) {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0 max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold font-serif text-[var(--color-text-bright)] mb-2">Architecture Patterns</h1>
        <p className="text-[var(--color-text-muted)] mb-6">Cross-cutting patterns observed across all 7 frameworks.</p>
        <div className="tldr">
          <p className="text-sm text-[var(--color-text)]">
            Five patterns recur across frameworks: the agent loop (with 5 variations), memory retrieval (4 approaches from RRF to no-search), tool sandboxing (5 levels from WASM to none), channel abstraction (converging interface), and context window management (4 strategies). The workspace convention (AGENTS.md/SOUL.md/MEMORY.md) emerged independently in 5 of 7 frameworks.
          </p>
        </div>
        <MarkdownRenderer content={content} />
      </div>
      <TableOfContents headings={headings} />
    </div>
  );
}
