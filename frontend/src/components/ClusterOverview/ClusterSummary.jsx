export default function ClusterSummary({ health, secondsAgo }) {
  if (!health) return null;

  const podsRatio = health.podsTotal > 0 ? (health.podsRunning / health.podsTotal) * 100 : 0;
  const podsColor = podsRatio > 90
    ? 'text-status-green'
    : podsRatio >= 80
      ? 'text-status-yellow'
      : 'text-status-red';

  const stats = [
    {
      label: 'Pods Running',
      value: `${health.podsRunning}/${health.podsTotal}`,
      color: podsColor,
    },
    {
      label: 'Namespaces',
      value: health.namespaces,
      color: 'text-status-blue',
    },
    {
      label: 'Nodes Ready',
      value: `${health.nodesReady}/${health.nodesTotal}`,
      color: health.nodesReady === health.nodesTotal ? 'text-status-green' : 'text-status-red',
    },
    {
      label: 'Uptime',
      value: `${health.uptimeDays}d`,
      color: 'text-text-primary',
    },
  ];

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-bg-card px-6 py-4">
      <div className="flex flex-wrap gap-6">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-wider text-text-secondary">
              {label}
            </span>
            <span className={`text-2xl font-bold ${color}`}>{value}</span>
          </div>
        ))}
      </div>
      <span className="text-xs text-text-secondary">
        Actualizado hace {secondsAgo}s
      </span>
    </div>
  );
}
