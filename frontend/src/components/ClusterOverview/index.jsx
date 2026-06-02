import ClusterSummary from './ClusterSummary';
import NodeCard from './NodeCard';

export default function ClusterOverview({ nodes, health, loading, error, secondsAgo }) {
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
        Error loading cluster data: {error}
      </div>
    );
  }

  return (
    <div>
      <ClusterSummary health={health} secondsAgo={secondsAgo} />
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
        {nodes.map((node) => (
          <NodeCard key={node.name} node={node} />
        ))}
      </div>
    </div>
  );
}
