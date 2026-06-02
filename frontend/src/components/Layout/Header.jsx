const NAV_ITEMS = [
  { id: 'cluster', label: 'Cluster' },
  { id: 'gitops', label: 'GitOps' },
  { id: 'cicd', label: 'CI/CD' },
  { id: 'metrics', label: 'Metrics' },
  { id: 'architecture', label: 'Arquitectura' },
  { id: 'repos', label: 'Repos' },
];

export default function Header() {
  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg-primary/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="https://luisops.com" target="_blank" rel="noopener noreferrer" className="text-xl font-bold tracking-tight text-text-primary hover:text-status-blue transition-colors">
          luisops<span className="text-status-blue">.com</span>
        </a>

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
        </div>
      </div>
    </header>
  );
}
