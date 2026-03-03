import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const analysesDir = path.join(process.cwd(), '..', 'analyses');

export function getAnalysisContent(slug: string): { content: string; data: Record<string, unknown> } {
  const filePath = path.join(analysesDir, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  return { data, content };
}

export function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const headingRegex = /^(#{1,4})\s+(.+)$/gm;
  const headings: { id: string; text: string; level: number }[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[2].replace(/[`*_~]/g, '');
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    headings.push({ id, text, level: match[1].length });
  }
  return headings;
}
