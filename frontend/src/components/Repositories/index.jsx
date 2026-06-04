const REPOS = [
  {
    name: 'app-luisops',
    url: 'https://github.com/luisrodvilladaorg/app-luisops',
    description: 'Source code for this live dashboard, including backend APIs, frontend UI, and Kubernetes manifests.',
    tags: ['React', 'Node.js', 'Kubernetes', 'ArgoCD', 'Observability'],
  },
  {
    name: 'wellness-ops',
    url: 'https://github.com/luisrodvilladaorg/wellness-ops',
    description: 'Full-stack Node.js/PostgreSQL app with GitOps, multi-environment CI/CD, and full observability stack',
    tags: ['Kubernetes', 'ArgoCD', 'GitHub Actions', 'Prometheus', 'Grafana', 'Loki', 'Velero'],
  },
  {
    name: 'terraform-aws-production-stack',
    url: 'https://github.com/luisrodvilladaorg/terraform-aws-production-stack',
    description: 'Production-grade AWS infrastructure as code — VPC, ALB, ASG, RDS, S3, IAM, CloudWatch',
    tags: ['Terraform', 'AWS', 'IaC', 'GitHub Actions', 'ARC Runner'],
  },
  {
    name: 'k8s-labs',
    url: 'https://github.com/luisrodvilladaorg/k8s-labs',
    description: 'Hands-on Kubernetes labs — NetworkPolicy, Taints & Tolerations, Ingress, NodeAffinity, RBAC',
    tags: ['Kubernetes', 'YAML', 'kubeadm', 'Labs'],
  },
];

function RepoCard({ repo }) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-lg border border-border bg-bg-card p-5 transition-colors hover:border-status-blue/50"
    >
      <div className="mb-3 flex items-center gap-2">
        <svg className="h-5 w-5 text-text-secondary group-hover:text-status-blue transition-colors" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
        </svg>
        <span className="text-base font-semibold text-status-blue group-hover:underline">
          {repo.name}
        </span>
      </div>

      <p className="mb-4 flex-1 text-sm text-text-secondary">
        {repo.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {repo.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-bg-hover px-2.5 py-0.5 text-xs font-medium text-text-secondary"
          >
            {tag}
          </span>
        ))}
      </div>
    </a>
  );
}

export default function Repositories() {
  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
      {REPOS.map((repo) => (
        <RepoCard key={repo.name} repo={repo} />
      ))}
    </div>
  );
}
