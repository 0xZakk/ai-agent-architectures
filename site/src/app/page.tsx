import Link from 'next/link';
import { frameworks } from '@/lib/frameworks';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-[var(--color-text-bright)] mb-4">
          AI Agent Architectures
        </h1>
        <p className="text-lg text-[var(--color-text-muted)] mb-6 leading-relaxed">
          A deep technical comparison of 7 AI agent frameworks, written for software engineers
          who want to understand how AI agents are built -- and how to build their own.
        </p>
        <div className="tldr">
          <p className="text-sm text-[var(--color-text)]">
            This site analyzes the source code of 7 open-source AI agent frameworks across architecture,
            memory, tools, security, LLM integration, and more. Each framework analysis is 30+ pages of
            annotated code and architecture diagrams. The <Link href="/comparison" className="text-[var(--color-accent)]">Comparison</Link> page
            synthesizes findings across all seven. The <Link href="/build-your-own" className="text-[var(--color-accent)]">Build Your Own</Link> guide
            distills patterns into actionable advice.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[var(--color-text-bright)] mb-1">Who is this for?</h2>
        <p className="text-[var(--color-text-muted)] text-sm mb-4">
          Software engineers who want to go beyond &ldquo;call the API&rdquo; and understand the systems
          engineering behind AI agents: event loops, memory architectures, tool sandboxing, context window
          management, multi-channel abstractions, and security models.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[var(--color-text-bright)] mb-1">How to use this site</h2>
        <ul className="text-sm text-[var(--color-text-muted)] space-y-1 list-disc pl-5">
          <li>Start with the <Link href="/comparison" className="text-[var(--color-accent)]">Comparison</Link> for a bird&apos;s-eye view</li>
          <li>Dive into individual <strong className="text-[var(--color-text)]">framework pages</strong> for annotated source analysis</li>
          <li>Read <Link href="/patterns" className="text-[var(--color-accent)]">Architecture Patterns</Link> for cross-cutting design themes</li>
          <li>Use <Link href="/build-your-own" className="text-[var(--color-accent)]">Build Your Own</Link> when you&apos;re ready to start coding</li>
        </ul>
      </div>

      <h2 className="text-xl font-semibold text-[var(--color-text-bright)] mb-4">The Frameworks</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {frameworks.map((fw) => (
          <Link
            key={fw.id}
            href={`/framework/${fw.id}`}
            className="block p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-accent-dim)] transition-colors group"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{fw.icon}</span>
              <div>
                <h3 className="font-semibold text-[var(--color-text-bright)] group-hover:text-[var(--color-accent)] transition-colors">
                  {fw.name}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--color-border)]" style={{ color: fw.color }}>
                  {fw.language}
                </span>
              </div>
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">{fw.tagline}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        <Link href="/comparison" className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-accent-dim)] transition-colors text-center">
          <span className="text-2xl block mb-1">⚖️</span>
          <span className="text-sm font-medium text-[var(--color-text-bright)]">Comparison</span>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Cross-framework analysis</p>
        </Link>
        <Link href="/patterns" className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-accent-dim)] transition-colors text-center">
          <span className="text-2xl block mb-1">🧩</span>
          <span className="text-sm font-medium text-[var(--color-text-bright)]">Patterns</span>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Recurring design patterns</p>
        </Link>
        <Link href="/build-your-own" className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-accent-dim)] transition-colors text-center">
          <span className="text-2xl block mb-1">🔧</span>
          <span className="text-sm font-medium text-[var(--color-text-bright)]">Build Your Own</span>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Actionable guide</p>
        </Link>
      </div>
    </div>
  );
}
