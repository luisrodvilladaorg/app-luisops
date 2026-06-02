import SyncBadge from './SyncBadge';
import HealthBadge from './HealthBadge';

const ENV_STYLES = {
  dev: 'bg-status-blue/15 text-status-blue',
  staging: 'bg-status-yellow/15 text-status-yellow',
  prod: 'bg-status-green/15 text-status-green',
  monitoring: 'bg-border text-text-secondary',
  infra: 'bg-border text-text-secondary',
};

function extractEnvironment(name) {
  if (name.endsWith('-dev')) return 'dev';
  if (name.endsWith('-staging')) return 'staging';
  if (name.endsWith('-prod')) return 'prod';
  if (name.endsWith('-monitoring')) return 'monitoring';
  return 'infra';
}

function formatTimeAgo(dateString) {
  if (!dateString) return '—';
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

export default function AppRow({ app }) {
  const env = extractEnvironment(app.name);
  const envStyle = ENV_STYLES[env] || ENV_STYLES.infra;
  const shortRevision = app.revision ? app.revision.substring(0, 7) : '—';

  return (
    <tr className="border-b border-border transition-colors hover:bg-bg-hover">
      <td className="px-4 py-3 text-sm font-medium text-text-primary">
        {app.name}
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${envStyle}`}>
          {env}
        </span>
      </td>
      <td className="px-4 py-3">
        <SyncBadge status={app.syncStatus} />
      </td>
      <td className="px-4 py-3">
        <HealthBadge status={app.healthStatus} />
      </td>
      <td className="px-4 py-3 font-mono text-xs text-text-secondary">
        {shortRevision}
      </td>
      <td className="px-4 py-3 text-xs text-text-secondary">
        {formatTimeAgo(app.lastSync)}
      </td>
    </tr>
  );
}
