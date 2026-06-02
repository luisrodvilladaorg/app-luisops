import RunItem from './RunItem';
import Skeleton from '../shared/Skeleton';
import EmptyState from '../shared/EmptyState';

const ACTIONS_URL = 'https://github.com/luisrodvilladaorg/wellness-ops/actions';

function CICDSkeleton() {
  return (
    <div>
      {/* Summary bar skeleton */}
      <div className="mb-4 rounded-lg border border-border bg-bg-card px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-8" />
            <Skeleton className="h-7 w-4" />
            <Skeleton className="h-7 w-8" />
            <Skeleton className="h-4 w-24 ml-1" />
            <Skeleton className="h-6 w-48 rounded-full ml-3" />
          </div>
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      {/* Run items skeleton */}
      <div className="rounded-lg border border-border bg-bg-card overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border-b border-border/50 px-4 py-3 flex items-center gap-4">
            <Skeleton className="h-5 w-5 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CICDPipeline({ runs, loading, error, secondsAgo }) {
  if (loading) return <CICDSkeleton />;

  if (error) {
    return (
      <div className="rounded-lg border border-status-red/30 bg-status-red/10 p-6 text-center text-status-red">
        Error loading CI/CD data: {error}
      </div>
    );
  }

  if (!runs || runs.length === 0) {
    return <EmptyState icon="⚙️" message="No se encontraron ejecuciones de pipeline recientes" />;
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
