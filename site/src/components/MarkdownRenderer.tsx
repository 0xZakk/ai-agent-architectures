'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useEffect } from 'react';
import type { Components } from 'react-markdown';

function MermaidBlock({ code }: { code: string }) {
  useEffect(() => {
    import('mermaid').then((m) => {
      m.default.initialize({ startOnLoad: false, theme: 'dark', themeVariables: { primaryColor: '#7c8af6', primaryTextColor: '#c8cad8', lineColor: '#5c6ac4', secondaryColor: '#1e2030', tertiaryColor: '#161822' } });
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
