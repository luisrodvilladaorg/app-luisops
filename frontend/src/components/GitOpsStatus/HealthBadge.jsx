const HEALTH_STYLES = {
  Healthy: 'bg-status-green/15 text-status-green',
  Degraded: 'bg-status-red/15 text-status-red',
  Progressing: 'bg-status-blue/15 text-status-blue',
  Missing: 'bg-border text-text-secondary',
  Unknown: 'bg-border text-text-secondary',
};

export default function HealthBadge({ status }) {
  const style = HEALTH_STYLES[status] || HEALTH_STYLES.Unknown;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}
