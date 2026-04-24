'use client';

import MarkdownRenderer from '@/components/MarkdownRenderer';
import TableOfContents from '@/components/TableOfContents';

export default function BuildClient({ content, headings }: { content: string; headings: { id: string; text: string; level: number }[] }) {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0 max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold font-serif text-[var(--color-text-bright)] mb-2">Build Your Own Agent</h1>
        <p className="text-[var(--color-text-muted)] mb-6">Practical guidance drawn from all 8 frameworks.</p>
        <div className="tldr">
          <p className="text-sm text-[var(--color-text)]">
            Start with TypeScript or Python. Build the agent loop first, then add 3-4 tools, session persistence, system prompt, and a channel adapter. Memory search comes last. Use files for state -- add a database only when you actually need one. For studying codebases: HermitClaw first (smallest), then PicoClaw, pi, Spacebot, IronClaw, OpenClaw.
          </p>
        </div>
        <MarkdownRenderer content={content} />
      </div>
      <TableOfContents headings={headings} />
    </div>
  );
}
