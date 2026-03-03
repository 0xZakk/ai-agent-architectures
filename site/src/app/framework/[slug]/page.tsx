import { getAnalysisContent, extractHeadings } from '@/lib/markdown';
import { getFramework, frameworks } from '@/lib/frameworks';
import { notFound } from 'next/navigation';
import FrameworkPageClient from './FrameworkPageClient';

export function generateStaticParams() {
  return frameworks.map((fw) => ({ slug: fw.id }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  // We need to handle this synchronously for static export
  return {
    title: 'Framework Analysis - AI Agent Architectures',
  };
}

export default async function FrameworkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fw = getFramework(slug);
  if (!fw) notFound();

  const { content } = getAnalysisContent(slug);
  const headings = extractHeadings(content);

  return <FrameworkPageClient framework={fw} content={content} headings={headings} />;
}
