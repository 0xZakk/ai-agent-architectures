import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';

export const metadata: Metadata = {
  title: 'AI Agent Architectures',
  description: 'A deep-dive comparison of 6 AI agent frameworks for software engineers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <MobileNav />
          <main className="flex-1 min-w-0 lg:pt-0 pt-14">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
