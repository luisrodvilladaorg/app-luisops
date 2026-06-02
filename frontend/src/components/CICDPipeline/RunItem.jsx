const STATUS_CONFIG = {
  success: {
    icon: '\u2713',
    style: 'bg-status-green/15 text-status-green',
    label: 'Success',
  },
  failure: {
    icon: '\u2717',
    style: 'bg-status-red/15 text-status-red',
    label: 'Failure',
  },
  in_progress: {
    icon: '\u25CB',
    style: 'bg-status-yellow/15 text-status-yellow animate-pulse',
    label: 'In Progress',
  },
  cancelled: {
    icon: '\u25CB',
    style: 'bg-border text-text-secondary',
    label: 'Cancelled',
  },
};

const EVENT_LABELS = {
  push: 'push',
  pull_request: 'PR',
  workflow_dispatch: 'manual',
  schedule: 'schedule',
};

function formatDuration(seconds) {
  if (!seconds) return '\u2014';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function formatTimeAgo(dateString) {
  if (!dateString) return '\u2014';
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

export default function RunItem({ run }) {
  const statusKey = run.status === 'completed' ? (run.conclusion || 'success') : 'in_progress';
  const config = STATUS_CONFIG[statusKey] || STATUS_CONFIG.cancelled;
  const eventLabel = EVENT_LABELS[run.event] || run.event;

  return (
    <div className="flex items-center gap-4 border-b border-border px-5 py-4 transition-colors hover:bg-bg-hover">
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${config.style}`}>
        {config.icon}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-text-primary">
            {run.name}
          </span>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${config.style}`}>
            {config.label}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-text-secondary">
          <span className="inline-flex items-center gap-1">
            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor"><path d="M11.75 2.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 .75-.75zm-8.5 0a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5A.75.75 0 0 1 3.25 2.5zM5 5.372A2.25 2.25 0 0 0 3.25 7.5v.577c0 .27.044.531.125.78a2.25 2.25 0 1 0 3.25 0c.08-.249.125-.51.125-.78V7.5A2.25 2.25 0 0 0 5 5.372z"/></svg>
            {run.branch}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-border px-2 py-0.5">
            {eventLabel}
          </span>
          <span>{formatDuration(run.durationSeconds)}</span>
          <span>{formatTimeAgo(run.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
