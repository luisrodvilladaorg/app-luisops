const express = require('express');
const router = express.Router();
const cacheMiddleware = require('../middleware/cache');
const prometheusService = require('../services/prometheusService');

const isProd = process.env.NODE_ENV === 'production';
const fallbackEnabled = process.env.METRICS_FALLBACK_ENABLED
  ? process.env.METRICS_FALLBACK_ENABLED === 'true'
  : !isProd;

function fallbackHistory(hours = 24, step = '15m') {
  const now = Date.now();
  const points = Math.max(12, Math.floor((hours * 60) / 15));
  const intervalMs = 15 * 60 * 1000;

  const requestRate = [];
  const errorRate = [];
  const p95Latency = [];

  for (let i = points - 1; i >= 0; i -= 1) {
    const timestamp = now - (i * intervalMs);
    const wave = Math.sin((points - i) / 4);
    requestRate.push({ timestamp, value: parseFloat((1.35 + (wave * 0.12)).toFixed(4)) });
    errorRate.push({ timestamp, value: parseFloat(Math.max(0, 0.06 + (wave * 0.02)).toFixed(4)) });
    p95Latency.push({ timestamp, value: parseFloat((92 + (wave * 6)).toFixed(2)) });
  }

  return {
    requestRate,
    errorRate,
    p95Latency,
    period: `${hours}h`,
    step,
    timestamp: new Date().toISOString(),
    source: 'fallback',
  };
}

function fallbackREDMetrics() {
  return {
    requestRate: { value: 1.41, unit: 'req/s' },
    errorRate: { value: 0.04, unit: '%' },
    p95Latency: { value: 94, unit: 'ms' },
    timestamp: new Date().toISOString(),
    source: 'fallback',
  };
}

function fallbackSLO() {
  return {
    target: 99.5,
    current: 99.96,
    met: true,
    timestamp: new Date().toISOString(),
    source: 'fallback',
  };
}

// GET /api/metrics/red — request rate, error rate, P95 actuales
// Caché: 5 minutos (long)
router.get('/red', cacheMiddleware('long'), async (req, res) => {
  try {
    const metrics = await prometheusService.getREDMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching RED metrics:', error.message);

    if (fallbackEnabled) {
      return res.json(fallbackREDMetrics());
    }

    res.status(502).json({
      error: 'Failed to fetch RED metrics from Prometheus',
      detail: error.message
    });
  }
});

// GET /api/metrics/slo — porcentaje SLO 99.5% actual
// Caché: 5 minutos (long)
router.get('/slo', cacheMiddleware('long'), async (req, res) => {
  try {
    const slo = await prometheusService.getSLO();
    res.json(slo);
  } catch (error) {
    console.error('Error fetching SLO:', error.message);

    if (fallbackEnabled) {
      return res.json(fallbackSLO());
    }

    res.status(502).json({
      error: 'Failed to fetch SLO from Prometheus',
      detail: error.message
    });
  }
});

// GET /api/metrics/history — series temporales últimas 24h
// Caché: 15 minutos (extraLong)
router.get('/history', cacheMiddleware('extraLong'), async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const step = req.query.step || '15m';
    const history = await prometheusService.getHistory(hours, step);
    res.json(history);
  } catch (error) {
    console.error('Error fetching metrics history:', error.message);

    if (fallbackEnabled) {
      const hours = parseInt(req.query.hours) || 24;
      const step = req.query.step || '15m';
      return res.json(fallbackHistory(hours, step));
    }

    res.status(502).json({
      error: 'Failed to fetch metrics history from Prometheus',
      detail: error.message
    });
  }
});

module.exports = router;
