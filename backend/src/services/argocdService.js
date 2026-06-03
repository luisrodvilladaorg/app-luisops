const fs = require('fs');
const https = require('https');
const axios = require('axios');

const caCertPath = process.env.ARGOCD_CA_CERT_PATH;
let httpsAgent = new https.Agent();

// Si el certificado interno existe, se usa como CA de confianza.
// Si no existe, no se bloquea el arranque del backend.
if (caCertPath && fs.existsSync(caCertPath)) {
  const caCert = fs.readFileSync(caCertPath);
  httpsAgent = new https.Agent({ ca: caCert });
} else {
  console.warn('ARGOCD_CA_CERT_PATH not found, using default trust store');
}

// Cliente axios preconfigurado: baseURL + token + agent en cada llamada.
const argocdClient = axios.create({
  baseURL: process.env.ARGOCD_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.ARGOCD_TOKEN}`,
  },
  httpsAgent,
  timeout: 5000,
});

/**
 * Obtiene todas las applications de ArgoCD y devuelve solo los campos
 * relevantes para el dashboard: nombre, sync status, health, ultimo commit
 * y hora del ultimo sync.
 */
async function getApplications() {
  const response = await argocdClient.get('/applications');

  // La API devuelve { items: [...] }. Cada item es una application completa.
  const apps = response.data.items || [];

  return apps.map((app) => ({
    name: app.metadata.name,
    syncStatus: app.status?.sync?.status || 'Unknown',
    healthStatus: app.status?.health?.status || 'Unknown',
    revision: app.status?.sync?.revision || null,
    lastSync: app.status?.operationState?.finishedAt || null,
  }));
}

module.exports = { getApplications };