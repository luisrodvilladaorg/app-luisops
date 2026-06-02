function UsageBar({ label, percent, usedLabel, totalLabel }) {
  const barColor =
    percent >= 85
      ? 'bg-status-red'
      : percent >= 60
        ? 'bg-status-yellow'
        : 'bg-status-green';

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-text-secondary">{label}</span>
        <span className="font-mono text-text-primary">
          {usedLabel} / {totalLabel} ({percent}%)
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-border">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
}

function getEnvironmentLabel(labels) {
  if (labels['environment']) {
    return labels['environment'];
  }
  if (labels['node-role.kubernetes.io/control-plane'] !== undefined) {
    return 'control-plane';
  }
  return null;
}

function getEnvironmentBadgeColor(env) {
  switch (env) {
    case 'production':
      return 'bg-status-green/15 text-status-green';
    case 'non-production':
      return 'bg-status-blue/15 text-status-blue';
    case 'control-plane':
      return 'bg-status-yellow/15 text-status-yellow';
    default:
      return 'bg-border text-text-secondary';
  }
}

export default function NodeCard({ node }) {
  const isReady = node.status === 'Ready';
  const role = node.roles.length > 0 ? node.roles.join(', ') : 'worker';
  const env = getEnvironmentLabel(node.labels);

  return (
    <div className="rounded-lg border border-border bg-bg-card p-5 transition-colors hover:border-text-secondary/30">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">{node.name}</h3>
          <span className="text-xs font-medium uppercase tracking-wider text-text-secondary">
            {role}
          </span>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            isReady
              ? 'bg-status-green/15 text-status-green'
              : 'bg-status-red/15 text-status-red'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isReady ? 'bg-status-green' : 'bg-status-red'
            }`}
          />
          {node.status}
        </span>
      </div>

      <div className="mb-4 space-y-3">
        <UsageBar
          label="CPU"
          percent={node.cpu.percent}
          usedLabel={`${node.cpu.used.toFixed(2)} cores`}
          totalLabel={`${node.cpu.allocatable} cores`}
        />
        <UsageBar
          label="RAM"
          percent={node.memory.percent}
          usedLabel={`${node.memory.usedMi} Mi`}
          totalLabel={`${node.memory.allocatableMi} Mi`}
        />
      </div>

      {env && (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getEnvironmentBadgeColor(env)}`}
        >
          {env}
        </span>
      )}
    </div>
  );
}
