const express = require('express');
const router = express.Router();
const cache = require('../middleware/cache');
const k8s = require('../services/kubernetesService');

router.get('/', cache('short'), async (req, res) => {
  try {
    const health = await k8s.getClusterHealth();
    res.json({
      ...health,
      endpoints: {
        nodes: '/api/cluster/nodes',
        pods: '/api/cluster/pods',
        namespaces: '/api/cluster/namespaces',
        health: '/api/cluster/health'
      }
    });
  } catch (err) {
    console.error('Error fetching cluster summary:', err.message);
    res.status(500).json({ error: 'Failed to fetch cluster summary' });
  }
});

router.get('/nodes', cache('short'), async (req, res) => {
  try {
    const nodes = await k8s.getNodes();
    res.json(nodes);
  } catch (err) {
    console.error('Error fetching nodes:', err.message);
    res.status(500).json({ error: 'Failed to fetch nodes' });
  }
});

router.get('/pods', cache('short'), async (req, res) => {
  try {
    const pods = await k8s.getPods();
    res.json(pods);
  } catch (err) {
    console.error('Error fetching pods:', err.message);
    res.status(500).json({ error: 'Failed to fetch pods' });
  }
});

router.get('/namespaces', cache('short'), async (req, res) => {
  try {
    const namespaces = await k8s.getNamespaces();
    res.json(namespaces);
  } catch (err) {
    console.error('Error fetching namespaces:', err.message);
    res.status(500).json({ error: 'Failed to fetch namespaces' });
  }
});

router.get('/health', cache('short'), async (req, res) => {
  try {
    const health = await k8s.getClusterHealth();
    res.json(health);
  } catch (err) {
    console.error('Error fetching cluster health:', err.message);
    res.status(500).json({ error: 'Failed to fetch cluster health' });
  }
});

module.exports = router;