'use client';

import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="w-56 shrink-0 hidden xl:block">
      <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
          On this page
        </div>
        <nav className="space-y-0.5">
          {headings.filter(h => h.level <= 3).map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              className={`block text-xs py-0.5 transition-colors ${
                h.level === 3 ? 'pl-3' : ''
              } ${
                active === h.id
                  ? 'text-[var(--color-accent)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {h.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
