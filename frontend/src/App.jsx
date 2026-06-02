import Layout from './components/Layout';
import ClusterOverview from './components/ClusterOverview';
import GitOpsStatus from './components/GitOpsStatus';
import CICDPipeline from './components/CICDPipeline';
import useClusterData from './hooks/useClusterData';
import useGitOpsData from './hooks/useGitOpsData';
import useCICDData from './hooks/useCICDData';

const PLACEHOLDER_SECTIONS = [
  { id: 'metrics', title: 'Observability' },
  { id: 'architecture', title: 'Arquitectura' },
  { id: 'repos', title: 'Repositorios' },
];

function SectionPlaceholder({ id, title }) {
  return (
    <section id={id} className="mb-12 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold text-text-primary">{title}</h2>
      <div className="rounded-lg border border-border bg-bg-card p-8 text-center text-text-secondary">
        {title} — próximamente
      </div>
    </section>
  );
}

export default function App() {
  const cluster = useClusterData();
  const gitops = useGitOpsData();
  const cicd = useCICDData();

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

      {PLACEHOLDER_SECTIONS.map(({ id, title }) => (
        <SectionPlaceholder key={id} id={id} title={title} />
      ))}
    </Layout>
  );
}
