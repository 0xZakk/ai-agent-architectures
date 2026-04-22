import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'AI Agent Architectures',
  description: 'A deep-dive comparison of 6 AI agent frameworks for software engineers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var theme = localStorage.getItem('theme');
              if (theme === 'light') {
                document.documentElement.classList.remove('dark');
              }
            } catch(e) {}
          })();
        `}} />
      </head>
      <body className="antialiased font-sans">
        <div className="flex min-h-screen">
          <Sidebar />
          <MobileNav />
          <div className="flex-1 min-w-0 flex flex-col lg:pt-0 pt-14">
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
