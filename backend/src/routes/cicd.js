const express = require('express');
const router = express.Router();
const cache = require('../middleware/cache');
const github = require('../services/githubService');

router.get('/runs', cache('medium'), async (req, res) => {
  try {
    const runs = await github.getWorkflowRuns();
    res.json(runs);
  } catch (err) {
    console.error('Error fetching GitHub workflow runs:', err.message);
    res.status(500).json({ error: 'Failed to fetch GitHub workflow runs' });
  }
});

module.exports = router;