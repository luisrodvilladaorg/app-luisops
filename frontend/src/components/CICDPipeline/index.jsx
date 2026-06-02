import RunItem from './RunItem';

const ACTIONS_URL = 'https://github.com/luisrodvilladaorg/wellness-ops/actions';

export default function CICDPipeline({ runs, loading, error, secondsAgo }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-border bg-bg-card p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-status-blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-status-red/30 bg-status-red/10 p-6 text-center text-status-red">
        Error loading CI/CD data: {error}
      </div>
    );
  }

  const successCount = runs.filter((r) => r.conclusion === 'success').length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-bg-card px-6 py-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-status-green">{successCount}</span>
            <span className="text-2xl font-bold text-text-secondary">/</span>
            <span className="text-2xl font-bold text-text-primary">{runs.length}</span>
            <span className="text-sm text-text-secondary">runs exitosos</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-status-blue/15 px-3 py-1 text-xs font-medium text-status-blue">
            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.75A2.75 2.75 0 0 1 4.75 0h6.5A2.75 2.75 0 0 1 14 2.75v10.5A2.75 2.75 0 0 1 11.25 16h-6.5A2.75 2.75 0 0 1 2 13.25Zm6 1a.75.75 0 0 0-.75.75v4a.75.75 0 0 0 1.5 0v-4A.75.75 0 0 0 8 3.75ZM8 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>
            Self-hosted runner (arc-runner-set)
          </span>
        </div>
        <span className="text-xs text-text-secondary">
          Actualizado hace {secondsAgo}s
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-bg-card">
        {runs.map((run, i) => (
          <RunItem key={`${run.name}-${run.createdAt}-${i}`} run={run} />
        ))}
      </div>

      <div className="mt-3 text-right">
        <a
          href={ACTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-status-blue hover:underline"
        >
          Ver todos los runs en GitHub &rarr;
        </a>
      </div>
    </div>
  );
}
