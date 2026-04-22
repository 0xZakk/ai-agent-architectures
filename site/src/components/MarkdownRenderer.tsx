'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useEffect } from 'react';
import type { Components } from 'react-markdown';

function MermaidBlock({ code }: { code: string }) {
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
      m.default.run({ querySelector: '.mermaid' });
    });
  }, [code]);
  return <div className="mermaid">{code}</div>;
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
