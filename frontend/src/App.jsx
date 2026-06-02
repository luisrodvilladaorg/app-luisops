import Layout from './components/Layout';

const SECTIONS = [
  { id: 'cluster', title: 'Cluster Overview' },
  { id: 'gitops', title: 'GitOps Status' },
  { id: 'cicd', title: 'CI/CD Pipeline' },
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
  return (
    <Layout>
      {SECTIONS.map(({ id, title }) => (
        <SectionPlaceholder key={id} id={id} title={title} />
      ))}
    </Layout>
  );
}
