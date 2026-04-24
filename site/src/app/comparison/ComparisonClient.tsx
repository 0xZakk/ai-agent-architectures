'use client';

import MarkdownRenderer from '@/components/MarkdownRenderer';
import TableOfContents from '@/components/TableOfContents';

export default function ComparisonClient({ content, headings }: { content: string; headings: { id: string; text: string; level: number }[] }) {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0 max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold font-serif text-[var(--color-text-bright)] mb-2">Cross-Framework Comparison</h1>
        <p className="text-[var(--color-text-muted)] mb-6">All 8 frameworks, side by side, across every dimension I could measure.</p>
        <div className="tldr">
          <p className="text-sm text-[var(--color-text)]">
            <strong>Architecture:</strong> Most do request-response; HermitClaw runs continuously; Spacebot delegates; the Agents SDK orchestrates multi-agent handoffs.{' '}
            <strong>Memory:</strong> Three use hybrid search (RRF), two have none, HermitClaw uses 3-factor retrieval, and the Agents SDK gives you 10+ pluggable session backends.{' '}
            <strong>Security:</strong> IronClaw goes deepest with 5-layer defense; Hermes adds prompt injection scanning; the Agents SDK uses guardrails + human-in-the-loop; pi has none by design.{' '}
            <strong>Channels:</strong> PicoClaw supports 10, OpenClaw 7, Hermes 6.{' '}
            <strong>Footprint:</strong> PicoClaw runs in &lt;10MB RAM on a $10 board.
          </p>
        </div>
        <MarkdownRenderer content={content} />
      </div>
      <TableOfContents headings={headings} />
    </div>
  );
}
