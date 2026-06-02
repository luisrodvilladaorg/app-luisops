const axios = require('axios');

const GITHUB_API_URL =
  'https://api.github.com/repos/luisrodvilladaorg/wellness-ops/actions/runs';

const githubClient = axios.create({
  baseURL: GITHUB_API_URL,
  headers: {
    Accept: 'application/vnd.github.v3+json',
  },
  timeout: 5000,
});

/**
 * Obtiene los ultimos 10 workflow runs de GitHub Actions.
 * Devuelve nombre, estado, conclusion, duracion, trigger y rama.
 */
async function getWorkflowRuns() {
  const response = await githubClient.get('', {
    params: { per_page: 10 },
  });

  const runs = response.data.workflow_runs || [];

  return runs.map((run) => {
    // Calcula duracion solo si el run ha terminado.
    let durationSeconds = null;
    if (run.status === 'completed' && run.run_started_at && run.updated_at) {
      const start = new Date(run.run_started_at);
      const end = new Date(run.updated_at);
      durationSeconds = Math.round((end - start) / 1000);
    }

    return {
      name: run.name,
      status: run.status,
      conclusion: run.conclusion,
      durationSeconds,
      event: run.event,
      branch: run.head_branch,
      createdAt: run.created_at,
    };
  });
}

module.exports = { getWorkflowRuns };