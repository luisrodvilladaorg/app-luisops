import { useMemo, useState } from 'react';
import AppRow from './AppRow';
import Skeleton from '../shared/Skeleton';
import EmptyState from '../shared/EmptyState';

const ENV_OPTIONS = ['all', 'dev', 'staging', 'prod', 'infra'];

function extractEnvironment(name) {
  if (name.endsWith('-dev')) return 'dev';
  if (name.endsWith('-staging')) return 'staging';
  if (name.endsWith('-prod')) return 'prod';
  if (name.endsWith('-monitoring')) return 'monitoring';
  return 'infra';
}

function GitOpsSkeleton() {
  return (
    <div>
      {/* Summary bar skeleton */}
      <div className="mb-4 rounded-lg border border-border bg-bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-8" />
            <Skeleton className="h-7 w-4" />
            <Skeleton className="h-7 w-8" />
            <Skeleton className="h-4 w-28 ml-1" />
          </div>
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      {/* Table skeleton */}
      <div className="rounded-lg border border-border bg-bg-card">
        <div className="border-b border-border px-4 py-3 flex gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-3 w-20" />
          ))}
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border-b border-border/50 px-4 py-3 flex gap-4">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GitOpsStatus({ applications, loading, error, secondsAgo }) {
  const [selectedEnv, setSelectedEnv] = useState('all');
  const appList = applications || [];

  const filteredApplications = useMemo(() => {
    if (selectedEnv === 'all') return appList;
    return appList.filter((app) => extractEnvironment(app.name) === selectedEnv);
  }, [appList, selectedEnv]);

  if (loading && appList.length === 0) return <GitOpsSkeleton />;

  if (error && appList.length === 0) {
    return (
      <div className="rounded-lg border border-status-red/30 bg-status-red/10 p-6 text-center text-status-red">
        Error loading GitOps data: {error}
      </div>
    );
  }

  if (appList.length === 0) {
    return <EmptyState icon="🔄" message="No applications found in ArgoCD" />;
  }

  const syncedCount = filteredApplications.filter((a) => a.syncStatus === 'Synced').length;
  const totalCount = filteredApplications.length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-bg-card px-6 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-status-green">{syncedCount}</span>
            <span className="text-2xl font-bold text-text-secondary">/</span>
            <span className="text-2xl font-bold text-text-primary">{totalCount}</span>
            <span className="text-sm text-text-secondary">synced apps</span>
          </div>
          <span className="text-xs text-text-secondary">
            Showing {totalCount} of {appList.length}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {ENV_OPTIONS.map((env) => {
              const isActive = selectedEnv === env;
              return (
                <button
                  key={env}
                  type="button"
                  onClick={() => setSelectedEnv(env)}
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${isActive ? 'border-status-blue bg-status-blue/15 text-status-blue' : 'border-border text-text-secondary hover:border-status-blue/40 hover:text-text-primary'}`}
                >
                  {env === 'all' ? 'all' : env}
                </button>
              );
            })}
          </div>
        </div>
        <span className="text-xs text-text-secondary">
          Updated {secondsAgo}s ago
        </span>
      </div>

      {filteredApplications.length === 0 && (
        <div className="mb-4">
          <EmptyState icon="🧭" message={`No apps in environment: ${selectedEnv}`} />
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-lg border border-border bg-bg-card md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">Application</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">Environment</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">Sync</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">Health</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">Commit</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">Last Sync</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <AppRow key={app.name} app={app} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {filteredApplications.map((app) => (
          <div key={app.name} className="rounded-lg border border-border bg-bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-text-primary text-sm">{app.name}</span>
              <span className="text-xs text-text-secondary">{extractEnvironment(app.name)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${app.syncStatus === 'Synced' ? 'bg-status-green/15 text-status-green' : 'bg-status-yellow/15 text-status-yellow'}`}>
                {app.syncStatus}
              </span>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${app.healthStatus === 'Healthy' ? 'bg-status-green/15 text-status-green' : 'bg-status-red/15 text-status-red'}`}>
                {app.healthStatus}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span className="font-mono">{app.revision ? app.revision.slice(0, 7) : '—'}</span>
              <span>{app.lastSync || '—'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
