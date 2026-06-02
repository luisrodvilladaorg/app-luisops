require('dotenv').config();
const express = require('express');
const cors = require('./middleware/cors');

const clusterRoutes = require('./routes/cluster');
const gitopsRoutes = require('./routes/gitops');
const cicdRoutes = require('./routes/cicd');
const metricsRoutes = require('./routes/metrics');

const app = express();
const PORT = process.env.PORT || 3100;

app.use(cors);
app.use(express.json());

app.use('/api/cluster', clusterRoutes);
app.use('/api/gitops', gitopsRoutes);
app.use('/api/cicd', cicdRoutes);
app.use('/api/metrics', metricsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Dashboard backend running on port ${PORT}`);
});