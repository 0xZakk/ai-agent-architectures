'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useEffect, useState, useCallback, useRef } from 'react';
import type { Components } from 'react-markdown';

function ExpandIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 1 1 1 1 4" />
      <polyline points="12 1 15 1 15 4" />
      <polyline points="4 15 1 15 1 12" />
      <polyline points="12 15 15 15 15 12" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="4" x2="12" y2="12" />
      <line x1="12" y1="4" x2="4" y2="12" />
    </svg>
  );
}

function MermaidBlock({ code }: { code: string }) {
  const [expanded, setExpanded] = useState(false);
  const [svgHtml, setSvgHtml] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import('mermaid').then((m) => {
      const isDark = document.documentElement.classList.contains('dark');
      m.default.initialize({
        startOnLoad: false,
        theme: isDark ? 'dark' : 'default',
        themeVariables: isDark
          ? { primaryColor: '#4A7C2C', primaryTextColor: '#E8E4DD', lineColor: '#6B9F4D', secondaryColor: '#2e2e2a', tertiaryColor: '#252522' }
          : { primaryColor: '#2D5016', primaryTextColor: '#2C2C2C', lineColor: '#4A7C2C', secondaryColor: '#F5F2ED', tertiaryColor: '#E8E4DD' },
      });
      m.default.run({ querySelector: '.mermaid' }).then(() => {
        if (containerRef.current) {
          const svg = containerRef.current.querySelector('svg');
          if (svg) setSvgHtml(svg.outerHTML);
        }
      });
    });
  }, [code]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setExpanded(false);
  }, []);

  useEffect(() => {
    if (expanded) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [expanded, handleKeyDown]);

  return (
    <>
      <div className="diagram-wrapper group relative">
        <button
          onClick={() => setExpanded(true)}
          className="diagram-expand-btn absolute top-2 right-2 z-10 p-1.5 rounded-md bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Expand diagram"
          title="Expand to full screen"
        >
          <ExpandIcon />
        </button>
        <div className="mermaid" ref={containerRef}>{code}</div>
      </div>

      {expanded && svgHtml && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-bg)]/95 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setExpanded(false); }}
        >
          <button
            onClick={() => setExpanded(false)}
            className="absolute top-4 right-4 z-[101] p-2 rounded-md bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-accent)] transition-colors"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
          <div
            className="mermaid-fullscreen overflow-auto p-8"
            dangerouslySetInnerHTML={{ __html: svgHtml }}
          />
        </div>
      )}
    </>
  );
}

export default function MarkdownRenderer({ content }: { content: string }) {
  const components: Components = {
    h1: ({ children, ...props }) => {
      const id = String(children).toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
      return <h1 id={id} {...props}>{children}</h1>;
    },
    h2: ({ children, ...props }) => {
      const id = String(children).toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
      return <h2 id={id} {...props}>{children}</h2>;
    },
    h3: ({ children, ...props }) => {
      const id = String(children).toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
      return <h3 id={id} {...props}>{children}</h3>;
    },
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const code = String(children).replace(/\n$/, '');
      if (match?.[1] === 'mermaid') {
        return <MermaidBlock code={code} />;
      }
      if (match) {
        return (
          <div className="relative">
            <span className="absolute top-2 right-3 text-xs text-[var(--color-text-muted)] opacity-60">{match[1]}</span>
            <code className={className} {...props}>{children}</code>
          </div>
        );
      }
      return <code className={className} {...props}>{children}</code>;
    },
  };

  return (
    <div className="prose-custom">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
