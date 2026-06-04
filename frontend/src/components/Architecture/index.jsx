const FLOW_ROWS = [
  {
    label: 'Hypervisor',
    items: [
      {
        name: 'Proxmox VE',
        detail: 'Bare-metal virtualization hosting 3 kubeadm nodes + 1 lab VM',
        tone: 'border-status-blue text-status-blue',
      },
    ],
  },
  {
    label: 'Cluster Nodes',
    items: [
      {
        name: 'control-plane',
        detail: '192.168.1.31 - etcd + API server + scheduler',
        tone: 'border-status-yellow text-status-yellow',
      },
      {
        name: 'worker-1 (non-prod)',
        detail: '192.168.1.32 - dev/staging workloads + monitoring',
        tone: 'border-status-blue text-status-blue',
      },
      {
        name: 'worker-2 (production)',
        detail: '192.168.1.33 - prod workloads + data services',
        tone: 'border-status-green text-status-green',
      },
    ],
  },
  {
    label: 'Cluster Services',
    items: [
      {
        name: 'ArgoCD',
        detail: 'GitOps sync engine for 19 apps',
        tone: 'border-status-green text-status-green',
      },
      {
        name: 'Prometheus + Grafana',
        detail: 'RED metrics + SLO dashboards',
        tone: 'border-status-yellow text-status-yellow',
      },
      {
        name: 'Loki + Promtail',
        detail: 'Centralized logs from all namespaces',
        tone: 'border-status-yellow text-status-yellow',
      },
    ],
  },
  {
    label: 'External',
    items: [
      {
        name: 'Cloudflare Tunnel',
        detail: 'Secure ingress without exposing public IP',
        tone: 'border-status-blue text-status-blue',
      },
      {
        name: 'Velero + AWS S3',
        detail: 'Scheduled backups for production namespaces',
        tone: 'border-status-green text-status-green',
      },
      {
        name: 'Terraform + AWS',
        detail: 'IaC stack for cloud infrastructure',
        tone: 'border-status-blue text-status-blue',
      },
    ],
  },
];

const CICD_CHAIN = ['GitHub', 'GitHub Actions', 'GHCR', 'ArgoCD', 'Kubernetes Services'];

function Box({ item }) {
  return (
    <div className={`rounded-lg border bg-bg-card px-4 py-3 ${item.tone}`}>
      <p className="text-sm font-semibold">{item.name}</p>
      <p className="mt-1 text-xs text-text-secondary">{item.detail}</p>
    </div>
  );
}

export default function Architecture() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-text-secondary">
        Visual flow of the production platform: Proxmox - kubeadm nodes - cluster services - external integrations
      </p>

      {FLOW_ROWS.map((row, rowIndex) => (
        <div key={row.label}>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-secondary">{row.label}</p>
          <div className={`grid gap-3 ${row.items.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
            {row.items.map((item) => (
              <Box key={item.name} item={item} />
            ))}
          </div>
          {rowIndex < FLOW_ROWS.length - 1 && (
            <div className="my-3 flex justify-center text-status-blue" aria-hidden="true">
              <span className="inline-flex items-center rounded-full border border-status-blue/40 bg-status-blue/10 px-3 py-1 text-xs font-medium">
                flow {'->'} next layer
              </span>
            </div>
          )}
        </div>
      ))}

      <div className="rounded-lg border border-border bg-bg-card px-4 py-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-secondary">
          CI/CD to GitOps Delivery Path
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {CICD_CHAIN.map((step, index) => (
            <div key={step} className="inline-flex items-center gap-2">
              <span className="rounded-full border border-status-blue/40 bg-status-blue/10 px-3 py-1 text-xs font-medium text-status-blue">
                {step}
              </span>
              {index < CICD_CHAIN.length - 1 && (
                <span className="text-text-secondary" aria-hidden="true">
                  {'->'}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
