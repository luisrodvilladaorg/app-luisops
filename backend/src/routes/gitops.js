const express = require('express');
const router = express.Router();
const cache = require('../middleware/cache');
const argocd = require('../services/argocdService');

router.get('/applications', cache('short'), async (req, res) => {
  try {
    const applications = await argocd.getApplications();
    res.json(applications);
  } catch (err) {
    console.error('Error fetching ArgoCD applications:', err.message);
    res.status(500).json({ error: 'Failed to fetch ArgoCD applications' });
  }
});

module.exports = router;