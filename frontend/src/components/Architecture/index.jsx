import { useState } from 'react';

const COMPONENTS = [
  {
    id: 'proxmox',
    label: 'Proxmox VE',
    detail: 'Hypervisor bare-metal hosting 4 VMs: 3 cluster nodes + 1 labs server',
    color: 'status-blue',
    row: 0,
    col: 'full',
  },
  {
    id: 'control-plane',
    label: 'control-plane',
    detail: '192.168.1.31 — etcd, API server, scheduler, controller-manager',
    color: 'status-yellow',
    row: 1,
    col: 0,
  },
  {
    id: 'worker-1',
    label: 'worker-1 (non-prod)',
    detail: '192.168.1.32 — dev + staging namespaces, monitoring stack',
    color: 'status-blue',
    row: 1,
    col: 1,
  },
  {
    id: 'worker-2',
    label: 'worker-2 (production)',
    detail: '192.168.1.33 — prod namespace, frontend + backend + postgres',
    color: 'status-green',
    row: 1,
    col: 2,
  },
  {
    id: 'github',
    label: 'GitHub',
    detail: 'Source of truth — wellness-ops, wellness-gitops, k8s-labs, terraform repos',
    color: 'text-primary',
    row: 2,
    col: 0,
  },
  {
    id: 'actions',
    label: 'GitHub Actions',
    detail: 'CI/CD — Quality Gate on PR, Deploy on push. Self-hosted runner via arc-runner-set',
    color: 'text-primary',
    row: 2,
    col: 1,
  },
  {
    id: 'ghcr',
    label: 'GHCR',
    detail: 'GitHub Container Registry — stores Docker images tagged by commit SHA',
    color: 'text-primary',
    row: 2,
    col: 2,
  },
  {
    id: 'argocd',
    label: 'ArgoCD',
    detail: 'GitOps controller — watches wellness-gitops repo, auto-syncs 19 applications',
    color: 'status-green',
    row: 3,
    col: 0,
  },
  {
    id: 'prometheus',
    label: 'Prometheus + Grafana',
    detail: 'Monitoring — kube-prometheus-stack, custom RED metrics, 6 dashboards in Git',
    color: 'status-yellow',
    row: 3,
    col: 1,
  },
  {
    id: 'loki',
    label: 'Loki + Promtail',
    detail: 'Log aggregation — collects logs from all pods, queryable via Grafana',
    color: 'status-yellow',
    row: 3,
    col: 2,
  },
  {
    id: 'cloudflare',
    label: 'Cloudflare Tunnel',
    detail: 'Secure external access — no public IPs, TLS at edge, routes to cluster services',
    color: 'status-blue',
    row: 4,
    col: 0,
  },
  {
    id: 'velero',
    label: 'Velero + AWS S3',
    detail: 'Cluster backups — scheduled daily for prod and staging namespaces',
    color: 'status-green',
    row: 4,
    col: 1,
  },
  {
    id: 'terraform',
    label: 'Terraform + AWS',
    detail: 'IaC — VPC, ALB, ASG, RDS, S3, IAM, CloudWatch. Separate production stack',
    color: 'status-blue',
    row: 4,
    col: 2,
  },
];

const FLOWS = [
  { from: 'github', to: 'actions', label: 'push / PR' },
  { from: 'actions', to: 'ghcr', label: 'build + push' },
  { from: 'ghcr', to: 'argocd', label: 'image update' },
  { from: 'argocd', to: 'worker-1', label: 'sync dev/staging' },
  { from: 'argocd', to: 'worker-2', label: 'sync prod' },
  { from: 'cloudflare', to: 'worker-2', label: 'HTTPS traffic' },
  { from: 'prometheus', to: 'control-plane', label: 'scrape metrics' },
  { from: 'velero', to: 'worker-2', label: 'backup snapshots' },
];

function ComponentBox({ comp, isActive, onHover, onLeave }) {
  const colorClass = `border-${comp.color}`;
  const bgClass = isActive ? `bg-${comp.color}/15` : 'bg-bg-card';

  return (
    <div
      className={`cursor-default rounded-lg border ${colorClass} ${bgClass} px-4 py-3 transition-all duration-200 hover:bg-${comp.color}/15`}
      onMouseEnter={() => onHover(comp.id)}
      onMouseLeave={onLeave}
    >
      <p className={`text-sm font-semibold text-${comp.color}`}>{comp.label}</p>
      {isActive && (
        <p className="mt-1 text-xs text-text-secondary">{comp.detail}</p>
      )}
    </div>
  );
}

export default function Architecture() {
  const [activeId, setActiveId] = useState(null);

  const activeFlows = activeId
    ? FLOWS.filter((f) => f.from === activeId || f.to === activeId)
    : [];

  const rows = [
    { label: 'Hypervisor', items: COMPONENTS.filter((c) => c.row === 0) },
    { label: 'Cluster Nodes', items: COMPONENTS.filter((c) => c.row === 1) },
    { label: 'CI/CD Pipeline', items: COMPONENTS.filter((c) => c.row === 2) },
    { label: 'Cluster Services', items: COMPONENTS.filter((c) => c.row === 3) },
    { label: 'External', items: COMPONENTS.filter((c) => c.row === 4) },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          Hover sobre cada componente para ver detalles
        </p>
      </div>

      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.label}>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-secondary">
              {row.label}
            </p>
            <div className={`grid gap-3 ${row.items[0]?.col === 'full' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
              {row.items.map((comp) => (
                <ComponentBox
                  key={comp.id}
                  comp={comp}
                  isActive={activeId === comp.id}
                  onHover={setActiveId}
                  onLeave={() => setActiveId(null)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {activeFlows.length > 0 && (
        <div className="mt-4 rounded-lg border border-border bg-bg-card px-5 py-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-secondary">
            Connections
          </p>
          <div className="flex flex-wrap gap-3">
            {activeFlows.map((flow, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-full bg-bg-hover px-3 py-1 text-xs text-text-primary"
              >
                <span className="font-medium">{flow.from}</span>
                <span className="text-text-secondary">&rarr;</span>
                <span className="font-medium">{flow.to}</span>
                <span className="text-text-secondary">({flow.label})</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
