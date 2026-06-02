export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-primary py-8">
      <div className="mx-auto max-w-7xl px-6 text-center text-sm text-text-secondary">
        <p>
          Infrastructure Dashboard — Deployed via{' '}
          <span className="text-status-blue">ArgoCD GitOps</span> on a kubeadm cluster
        </p>
        <p className="mt-2">
          <a
            href="https://github.com/luisrodvilladaorg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            github.com/luisrodvilladaorg
          </a>
        </p>
      </div>
    </footer>
  );
}
