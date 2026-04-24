import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          {/* Brand column */}
          <div>
            <a
              href="https://cherrywoodlabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono text-sm font-medium text-[var(--color-text-bright)] hover:text-[var(--color-accent)] transition-colors"
            >
              cherrywood_labs
            </a>
            <p className="mt-3 text-xs text-[var(--color-text-muted)] leading-relaxed">
              Research and development focused on the deployment phase of technological revolutions.
              We bridge installation and deployment through open research and collaborative discovery.
            </p>
          </div>

          {/* Site links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
              This Guide
            </h4>
            <nav className="space-y-2">
              <Link href="/" className="block text-sm text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors">Home</Link>
              <Link href="/comparison" className="block text-sm text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors">Comparison</Link>
              <Link href="/patterns" className="block text-sm text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors">Architecture Patterns</Link>
              <Link href="/build-your-own" className="block text-sm text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors">Build Your Own</Link>
            </nav>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
              Company
            </h4>
            <nav className="space-y-2">
              <a href="https://cherrywoodlabs.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors">About</a>
              <a href="https://x.com/0xZakk" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                @0xZakk
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-text-muted)]">
            &copy; {new Date().getFullYear()} Cherrywood Labs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
