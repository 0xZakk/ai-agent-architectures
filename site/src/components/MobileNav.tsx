'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { frameworks } from '@/lib/frameworks';
import ThemeToggle from './ThemeToggle';

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <div className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold font-serif text-[var(--color-accent)]">AI Agent Architectures</Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setOpen(!open)} className="text-[var(--color-text-muted)] p-1">
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-40 bg-[var(--color-bg)] pt-14 overflow-y-auto" onClick={() => setOpen(false)}>
          <nav className="p-4 space-y-1">
            {[
              { href: '/', label: 'Home' },
              { href: '/comparison', label: 'Comparison' },
              { href: '/patterns', label: 'Architecture Patterns' },
              { href: '/build-your-own', label: 'Build Your Own' },
            ].map((item) => (
              <Link key={item.href} href={item.href} className={`block px-3 py-2 rounded-md text-sm ${pathname === item.href ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-bright)]' : 'text-[var(--color-text-muted)]'}`}>
                {item.label}
              </Link>
            ))}
            <div className="mt-4 mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Frameworks</div>
            {frameworks.map((fw) => (
              <Link key={fw.id} href={`/framework/${fw.id}`} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${pathname === `/framework/${fw.id}` ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-bright)]' : 'text-[var(--color-text-muted)]'}`}>
                <span className="w-2 h-2 rounded-full" style={{ background: `var(--color-${fw.colorVar})` }} />
                {fw.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
