import ClusterSummary from './ClusterSummary';
import NodeCard from './NodeCard';
import Skeleton from '../shared/Skeleton';
import EmptyState from '../shared/EmptyState';

function ClusterSkeleton() {
  return (
    <div>
      <div className="mb-4 rounded-lg border border-border bg-bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-5 w-40" />
          </div>
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border border-border bg-bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ClusterOverview({ nodes, health, loading, error, secondsAgo }) {
  if (loading && (!nodes || nodes.length === 0)) return <ClusterSkeleton />;

  if (error && (!nodes || nodes.length === 0)) {
    return (
      <div className="rounded-lg border border-status-red/30 bg-status-red/10 p-6 text-center text-status-red">
        Error loading cluster data: {error}
      </div>
    );
  }

  if (!nodes || nodes.length === 0) {
    return <EmptyState icon="🖥️" message="No nodes found in the cluster" />;
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
