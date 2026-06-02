import AppRow from './AppRow';

export default function GitOpsStatus({ applications, loading, error, secondsAgo }) {
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
        Error loading GitOps data: {error}
      </div>
    );
  }

  const syncedCount = applications.filter((a) => a.syncStatus === 'Synced').length;
  const totalCount = applications.length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-bg-card px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-status-green">{syncedCount}</span>
          <span className="text-2xl font-bold text-text-secondary">/</span>
          <span className="text-2xl font-bold text-text-primary">{totalCount}</span>
          <span className="text-sm text-text-secondary">apps sincronizadas</span>
        </div>
        <span className="text-xs text-text-secondary">
          Actualizado hace {secondsAgo}s
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                Application
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                Environment
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                Sync
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                Health
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                Commit
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                Last Sync
              </th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <AppRow key={app.name} app={app} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
