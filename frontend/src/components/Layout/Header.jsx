import { useState } from 'react';

const NAV_ITEMS = [
  { id: 'cluster', label: 'Cluster' },
  { id: 'gitops', label: 'GitOps' },
  { id: 'cicd', label: 'CI/CD' },
  { id: 'metrics', label: 'Metrics' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'repos', label: 'Repos' },
  { id: 'author', label: 'Author' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleClick = (e, id) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg-primary/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="https://luisops.com" target="_blank" rel="noopener noreferrer" className="text-xl font-bold tracking-tight text-text-primary hover:text-status-blue transition-colors">
          luisops<span className="text-status-blue">.com</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => handleClick(e, id)}
              className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-status-green/15 px-3 py-1 text-xs font-medium text-status-green">
            <span className="h-2 w-2 rounded-full bg-status-green animate-pulse" />
            Live
          </span>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col items-center justify-center w-9 h-9 rounded-md hover:bg-bg-hover transition-colors"
            aria-label="Toggle navigation"
          >
            <span className={`block h-0.5 w-5 bg-text-secondary transition-all duration-200 ${mobileOpen ? 'translate-y-1.5 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-5 bg-text-secondary mt-1 transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-text-secondary mt-1 transition-all duration-200 ${mobileOpen ? '-translate-y-1.5 -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-bg-primary/95 backdrop-blur-md px-6 py-3">
          {NAV_ITEMS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => handleClick(e, id)}
              className="block rounded-md px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}