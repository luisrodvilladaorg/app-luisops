const SYNC_STYLES = {
  Synced: 'bg-status-green/15 text-status-green',
  OutOfSync: 'bg-status-yellow/15 text-status-yellow',
  Unknown: 'bg-border text-text-secondary',
};

export default function SyncBadge({ status }) {
  const style = SYNC_STYLES[status] || SYNC_STYLES.Unknown;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}
