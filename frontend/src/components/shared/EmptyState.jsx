/**
 * EmptyState — shown when an endpoint returns valid data but the array is empty.
 * Props: icon (optional emoji/char), message (string)
 */
export default function EmptyState({ icon = '📭', message }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-bg-card p-12 text-center">
      <span className="text-3xl mb-3" aria-hidden="true">{icon}</span>
      <p className="text-sm text-text-secondary">{message}</p>
    </div>
  );
}
