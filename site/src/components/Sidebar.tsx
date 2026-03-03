'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { frameworks } from '@/lib/frameworks';

const navItems = [
  { href: '/', label: 'Home', icon: '📖' },
  { href: '/comparison', label: 'Comparison', icon: '⚖️' },
  { href: '/patterns', label: 'Architecture Patterns', icon: '🧩' },
  { href: '/build-your-own', label: 'Build Your Own', icon: '🔧' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)] h-screen sticky top-0 overflow-y-auto hidden lg:block">
      <div className="p-5">
        <Link href="/" className="block mb-6">
          <h1 className="text-lg font-bold text-[var(--color-text-bright)]">AI Agent</h1>
          <h1 className="text-lg font-bold text-[var(--color-accent)]">Architectures</h1>
        </Link>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-bright)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-tertiary)]'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-6 mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          Frameworks
        </div>
        <nav className="space-y-0.5">
          {frameworks.map((fw) => (
            <Link
              key={fw.id}
              href={`/framework/${fw.id}`}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                pathname === `/framework/${fw.id}`
                  ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-bright)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-tertiary)]'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: fw.color }}
              />
              <span>{fw.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
