const PROMETHEUS_URL = process.env.PROMETHEUS_URL || 'http://kube-prom-kube-prometheus-prometheus.monitoring.svc.cluster.local:9090';

async function instantQuery(query) {
  const url = `${PROMETHEUS_URL}/api/v1/query?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });

  if (!res.ok) {
    throw new Error(`Prometheus query failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  if (data.status !== 'success') {
    throw new Error(`Prometheus error: ${data.error || 'unknown'}`);
  }

  return data.data.result;
}

async function rangeQuery(query, hours = 24, step = '15m') {
  const end = Math.floor(Date.now() / 1000);
  const start = end - (hours * 3600);
  const url = `${PROMETHEUS_URL}/api/v1/query_range?query=${encodeURIComponent(query)}&start=${start}&end=${end}&step=${step}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });

  if (!res.ok) {
    throw new Error(`Prometheus range query failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  if (data.status !== 'success') {
    throw new Error(`Prometheus error: ${data.error || 'unknown'}`);
  }

  return data.data.result;
}

function extractScalar(result) {
  if (!result || result.length === 0) return 0;
  if (result.length === 1) return parseFloat(result[0].value[1]) || 0;
  return result.reduce((sum, r) => sum + (parseFloat(r.value[1]) || 0), 0);
}

function formatTimeSeries(result) {
  if (!result || result.length === 0) return [];

  if (result.length === 1) {
    return result[0].values.map(([ts, val]) => ({
      timestamp: ts * 1000,
      value: parseFloat(val) || 0
    }));
  }

  const byTimestamp = {};
  for (const series of result) {
    for (const [ts, val] of series.values) {
      byTimestamp[ts] = (byTimestamp[ts] || 0) + (parseFloat(val) || 0);
    }
  }

  return Object.entries(byTimestamp)
    .sort(([a], [b]) => a - b)
    .map(([ts, val]) => ({
      timestamp: parseFloat(ts) * 1000,
      value: val
    }));
}

const QUERIES = {
  requestRate: 'sum(rate(wellness_http_requests_total[5m]))',
  errorRate: 'sum(rate(wellness_http_requests_total{status=~"5.."}[5m])) / sum(rate(wellness_http_requests_total[5m])) * 100',
  p95Latency: 'histogram_quantile(0.95, sum(rate(wellness_http_request_duration_seconds_bucket[5m])) by (le))',
sloCompliance: '(1 - ((sum(rate(wellness_http_requests_total{status=~"5.."}[24h])) or vector(0)) / sum(rate(wellness_http_requests_total[24h])))) * 100',
};

const RANGE_QUERIES = {
  requestRate: 'sum(rate(wellness_http_requests_total[5m]))',
  errorRate: 'sum(rate(wellness_http_requests_total{status=~"5.."}[5m])) / sum(rate(wellness_http_requests_total[5m])) * 100',
  p95Latency: 'histogram_quantile(0.95, sum(rate(wellness_http_request_duration_seconds_bucket[5m])) by (le))',
};

async function getREDMetrics() {
  const [requestRateResult, errorRateResult, p95Result] = await Promise.all([
    instantQuery(QUERIES.requestRate),
    instantQuery(QUERIES.errorRate),
    instantQuery(QUERIES.p95Latency),
  ]);

  return {
    requestRate: {
      value: parseFloat(extractScalar(requestRateResult).toFixed(4)),
      unit: 'req/s'
    },
    errorRate: {
      value: parseFloat(extractScalar(errorRateResult).toFixed(4)),
      unit: '%'
    },
    p95Latency: {
      value: parseFloat((extractScalar(p95Result) * 1000).toFixed(2)),
      unit: 'ms'
    },
    timestamp: new Date().toISOString()
  };
}

async function getSLO() {
  const result = await instantQuery(QUERIES.sloCompliance);
  const compliance = extractScalar(result);

  return {
    target: 99.5,
    current: parseFloat(compliance.toFixed(4)),
    met: compliance >= 99.5,
    timestamp: new Date().toISOString()
  };
}

async function getHistory(hours = 24, step = '15m') {
  const [requestRate, errorRate, p95Latency] = await Promise.all([
    rangeQuery(RANGE_QUERIES.requestRate, hours, step),
    rangeQuery(RANGE_QUERIES.errorRate, hours, step),
    rangeQuery(RANGE_QUERIES.p95Latency, hours, step),
  ]);

  return {
    requestRate: formatTimeSeries(requestRate),
    errorRate: formatTimeSeries(errorRate),
    p95Latency: formatTimeSeries(p95Latency).map(point => ({
      ...point,
      value: parseFloat((point.value * 1000).toFixed(2))
    })),
    period: `${hours}h`,
    step,
    timestamp: new Date().toISOString()
  };
}

module.exports = { getREDMetrics, getSLO, getHistory };
