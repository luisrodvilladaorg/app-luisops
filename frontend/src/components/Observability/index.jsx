import MetricCard from './MetricCard';
import SLOGauge from './SLOGauge';

export default function Observability({ red, slo, history, loading, error, secondsAgo }) {
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
        Error loading metrics: {error}
      </div>
    );
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
