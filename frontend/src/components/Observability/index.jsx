import MetricCard from './MetricCard';
import SLOGauge from './SLOGauge';
import Skeleton from '../shared/Skeleton';
import EmptyState from '../shared/EmptyState';

function ObservabilitySkeleton() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border border-border bg-bg-card p-5">
            <Skeleton className="h-3 w-24 mb-3" />
            <Skeleton className="h-8 w-20 mb-4" />
            <Skeleton className="h-16 w-full rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Observability({ red, slo, history, loading, error, secondsAgo }) {
  if (loading) return <ObservabilitySkeleton />;

  if (error) {
    return (
      <div className="rounded-lg border border-status-red/30 bg-status-red/10 p-6 text-center text-status-red">
        Error loading metrics: {error}
      </div>
    );
  }

  if (!red && !slo) {
    return <EmptyState icon="📊" message="No hay métricas disponibles en este momento" />;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          RED metrics + SLO compliance — last 24h
        </p>
        <span className="text-xs text-text-secondary">
          Actualizado hace {secondsAgo}s
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Request Rate"
          value={red ? red.requestRate.value : 0}
          unit={red ? red.requestRate.unit : ''}
          data={history ? history.requestRate : []}
          color="blue"
        />
        <MetricCard
          title="Error Rate"
          value={red ? red.errorRate.value : 0}
          unit={red ? red.errorRate.unit : ''}
          data={history ? history.errorRate : []}
          color="red"
        />
        <MetricCard
          title="Latency P95"
          value={red ? red.p95Latency.value : 0}
          unit={red ? red.p95Latency.unit : ''}
          data={history ? history.p95Latency : []}
          color="yellow"
        />
        <SLOGauge
          target={slo ? slo.target : 99.5}
          current={slo ? slo.current : 0}
          met={slo ? slo.met : false}
        />
      </div>

      <p className="mt-4 text-xs text-text-secondary">
        6 Grafana dashboards versionados en Git &middot; Prometheus + Loki stack
      </p>
    </div>
  );
}
