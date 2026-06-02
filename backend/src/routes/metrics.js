const express = require('express');
const router = express.Router();
const cacheMiddleware = require('../middleware/cache');
const prometheusService = require('../services/prometheusService');

// GET /api/metrics/red — request rate, error rate, P95 actuales
// Caché: 5 minutos (long)
router.get('/red', cacheMiddleware('long'), async (req, res) => {
  try {
    const metrics = await prometheusService.getREDMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching RED metrics:', error.message);
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
    res.status(502).json({
      error: 'Failed to fetch metrics history from Prometheus',
      detail: error.message
    });
  }
});

module.exports = router;
