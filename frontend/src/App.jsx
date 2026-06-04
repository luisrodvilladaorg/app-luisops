import Layout from './components/Layout';
import ClusterOverview from './components/ClusterOverview';
import GitOpsStatus from './components/GitOpsStatus';
import CICDPipeline from './components/CICDPipeline';
import Observability from './components/Observability';
import Architecture from './components/Architecture';
import Repositories from './components/Repositories';
import useClusterData from './hooks/useClusterData';
import useGitOpsData from './hooks/useGitOpsData';
import useCICDData from './hooks/useCICDData';
import useMetricsData from './hooks/useMetricsData';

export default function App() {
  const cluster = useClusterData();
  const gitops = useGitOpsData();
  const cicd = useCICDData();
  const metrics = useMetricsData();
  const refreshCandidates = [cluster.secondsAgo, gitops.secondsAgo, cicd.secondsAgo, metrics.secondsAgo]
    .filter((value) => Number.isFinite(value));
  const lastRefreshSeconds = refreshCandidates.length > 0 ? Math.min(...refreshCandidates) : 0;
  const clusterConnected = !cluster.loading && !cluster.error;

  return (
    <Layout>
      <section className="mb-12 rounded-2xl border border-border bg-bg-card px-6 py-8 sm:px-8 sm:py-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
          Live Kubernetes Cluster Monitor
        </h1>
        <p className="mt-4 max-w-4xl text-sm leading-relaxed text-text-secondary sm:text-base">
          Real-time data from a 3-node kubeadm cluster running on bare-metal Proxmox · Not a demo — this is production infrastructure
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-medium sm:text-sm">
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${clusterConnected ? 'bg-status-green/15 text-status-green' : 'bg-status-yellow/15 text-status-yellow'}`}>
            <span className={`h-2 w-2 rounded-full ${clusterConnected ? 'bg-status-green animate-pulse' : 'bg-status-yellow'}`} />
            {clusterConnected ? 'Connected to cluster' : 'Connecting to cluster...'}
          </span>
          <span className="inline-flex items-center rounded-full bg-bg-hover px-3 py-1.5 text-text-secondary">
            Last refresh: {lastRefreshSeconds}s ago
          </span>
        </div>
      </section>

      <section id="cluster" className="mb-12 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold text-text-primary">Cluster Overview</h2>
        <ClusterOverview
          nodes={cluster.nodes}
          health={cluster.health}
          loading={cluster.loading}
          error={cluster.error}
          secondsAgo={cluster.secondsAgo}
        />
      </section>

      <section id="gitops" className="mb-12 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold text-text-primary">GitOps Status</h2>
        <GitOpsStatus
          applications={gitops.applications}
          loading={gitops.loading}
          error={gitops.error}
          secondsAgo={gitops.secondsAgo}
        />
      </section>

      <section id="cicd" className="mb-12 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold text-text-primary">CI/CD Pipeline</h2>
        <CICDPipeline
          runs={cicd.runs}
          loading={cicd.loading}
          error={cicd.error}
          secondsAgo={cicd.secondsAgo}
        />
      </section>

      <section id="metrics" className="mb-12 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold text-text-primary">Observability</h2>
        <Observability
          red={metrics.red}
          slo={metrics.slo}
          history={metrics.history}
          loading={metrics.loading}
          error={metrics.error}
          secondsAgo={metrics.secondsAgo}
        />
      </section>

      <section id="architecture" className="mb-12 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold text-text-primary">Arquitectura</h2>
        <Architecture />
      </section>

      <section id="repos" className="mb-12 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold text-text-primary">Repositorios</h2>
        <Repositories />
      </section>
    </Layout>
  );
}
