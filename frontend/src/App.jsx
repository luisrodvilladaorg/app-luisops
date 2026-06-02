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

  return (
    <Layout>
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
