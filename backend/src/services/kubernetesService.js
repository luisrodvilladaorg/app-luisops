const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();

if (process.env.KUBERNETES_SERVICE_HOST) {
  kc.loadFromCluster();
} else {
  kc.loadFromDefault();
}

const coreApi = kc.makeApiClient(k8s.CoreV1Api);
const metricsApi = kc.makeApiClient(k8s.CustomObjectsApi);

const K8S_TIMEOUT_MS = 8000;

function withTimeout(promise, ms = K8S_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`Kubernetes API timeout after ${ms}ms`)),
      ms
    );
    promise.then(
      (val) => { clearTimeout(timer); resolve(val); },
      (err) => { clearTimeout(timer); reject(err); }
    );
  });
}

async function getNodes() {
  const [nodesResponse, metricsResponse] = await Promise.all([
    withTimeout(coreApi.listNode()),
    withTimeout(metricsApi.listClusterCustomObject({
      group: 'metrics.k8s.io',
      version: 'v1beta1',
      plural: 'nodes'
    })).catch((err) => {
      console.error('Error fetching node metrics:', err.message);
      return { items: [] };
    }),
  ]);

  const nodes = nodesResponse.items;
  const metricsData = metricsResponse.items || [];

  return nodes.map((node) => {
    const name = node.metadata.name;
    const metrics = metricsData.find((m) => m.metadata.name === name);

    const allocatableCpu = parseCpu(node.status.allocatable.cpu);
    const allocatableMemory = parseMemory(node.status.allocatable.memory);
    const usedCpu = metrics ? parseCpu(metrics.usage.cpu) : 0;
    const usedMemory = metrics ? parseMemory(metrics.usage.memory) : 0;

    const ready = node.status.conditions.find((c) => c.type === 'Ready');

    return {
      name,
      roles: Object.keys(node.metadata.labels)
        .filter((l) => l.startsWith('node-role.kubernetes.io/'))
        .map((l) => l.replace('node-role.kubernetes.io/', '')) || ['worker'],
      status: ready && ready.status === 'True' ? 'Ready' : 'NotReady',
      cpu: {
        used: usedCpu,
        allocatable: allocatableCpu,
        percent: Math.round((usedCpu / allocatableCpu) * 100),
      },
      memory: {
        usedMi: Math.round(usedMemory / 1024 / 1024),
        allocatableMi: Math.round(allocatableMemory / 1024 / 1024),
        percent: Math.round((usedMemory / allocatableMemory) * 100),
      },
      labels: node.metadata.labels,
      createdAt: node.metadata.creationTimestamp,
    };
  });
}

async function getPods() {
  const podsResponse = await withTimeout(coreApi.listPodForAllNamespaces());

  return podsResponse.items.map((pod) => ({
    name: pod.metadata.name,
    namespace: pod.metadata.namespace,
    node: pod.spec.nodeName,
    status: pod.status.phase,
    ready: pod.status.containerStatuses
      ? pod.status.containerStatuses.every((c) => c.ready)
      : false,
    restarts: pod.status.containerStatuses
      ? pod.status.containerStatuses.reduce((sum, c) => sum + c.restartCount, 0)
      : 0,
  }));
}

async function getNamespaces() {
  const [nsResponse, podsResponse] = await Promise.all([
    withTimeout(coreApi.listNamespace()),
    withTimeout(coreApi.listPodForAllNamespaces()),
  ]);

  return nsResponse.items.map((ns) => {
    const name = ns.metadata.name;
    const podCount = podsResponse.items.filter((p) => p.metadata.namespace === name).length;
    return { name, status: ns.status.phase, podCount };
  });
}

// Separated from getNodes() to avoid 6 redundant K8s API calls when
// /api/cluster/nodes and /api/cluster/health are fetched simultaneously.
async function getClusterHealth() {
  const [nodesResponse, podsResponse, nsResponse] = await Promise.all([
    withTimeout(coreApi.listNode()),
    withTimeout(coreApi.listPodForAllNamespaces()),
    withTimeout(coreApi.listNamespace()),
  ]);

  const nodes = nodesResponse.items;
  const pods = podsResponse.items;

  const readyNodes = nodes.filter((n) => {
    const ready = n.status.conditions.find((c) => c.type === 'Ready');
    return ready && ready.status === 'True';
  }).length;

  const runningPods = pods.filter((p) => p.status.phase === 'Running').length;

  const oldestNode = nodes.reduce((oldest, n) =>
    new Date(n.metadata.creationTimestamp) < new Date(oldest.metadata.creationTimestamp)
      ? n
      : oldest
  );
  const uptimeDays = Math.floor(
    (Date.now() - new Date(oldestNode.metadata.creationTimestamp).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return {
    nodesReady: readyNodes,
    nodesTotal: nodes.length,
    podsRunning: runningPods,
    podsTotal: pods.length,
    namespaces: nsResponse.items.length,
    uptimeDays,
  };
}

function parseCpu(cpu) {
  if (typeof cpu === 'number') return cpu;
  if (cpu.endsWith('n')) return parseInt(cpu) / 1000000000;
  if (cpu.endsWith('m')) return parseInt(cpu) / 1000;
  return parseFloat(cpu);
}

function parseMemory(mem) {
  if (typeof mem === 'number') return mem;
  if (mem.endsWith('Ki')) return parseInt(mem) * 1024;
  if (mem.endsWith('Mi')) return parseInt(mem) * 1024 * 1024;
  if (mem.endsWith('Gi')) return parseInt(mem) * 1024 * 1024 * 1024;
  return parseInt(mem);
}

module.exports = { getNodes, getPods, getNamespaces, getClusterHealth };
