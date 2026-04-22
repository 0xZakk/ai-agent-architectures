'use client';

import MarkdownRenderer from '@/components/MarkdownRenderer';
import TableOfContents from '@/components/TableOfContents';

export default function ComparisonClient({ content, headings }: { content: string; headings: { id: string; text: string; level: number }[] }) {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0 max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold font-serif text-[var(--color-text-bright)] mb-2">Cross-Framework Comparison</h1>
        <p className="text-[var(--color-text-muted)] mb-6">Side-by-side analysis of all 8 frameworks across every dimension.</p>
        <div className="tldr">
          <p className="text-sm text-[var(--color-text)]">
            <strong>Architecture:</strong> Most use request-response; HermitClaw is continuous; Spacebot delegates; the Agents SDK orchestrates multi-agent handoffs.{' '}
            <strong>Memory:</strong> Three use hybrid search (RRF); two have none; HermitClaw uses 3-factor retrieval; the Agents SDK offers 10+ pluggable session backends.{' '}
            <strong>Security:</strong> IronClaw leads with 5-layer defense; Hermes adds prompt injection scanning; the Agents SDK uses guardrails + human-in-the-loop; pi has none by design.{' '}
            <strong>Channels:</strong> PicoClaw has 10 (most), OpenClaw has 7, Hermes has 6.{' '}
            <strong>Footprint:</strong> PicoClaw runs in &lt;10MB RAM on a $10 board.
          </p>
        </div>
        <MarkdownRenderer content={content} />
      </div>
      <TableOfContents headings={headings} />
    </div>
  );
}
