/**
 * Skeleton pulse block — building block for section-specific loading states.
 * Usage: <Skeleton className="h-4 w-32" />
 */
export default function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded bg-bg-hover ${className}`}
      aria-hidden="true"
    />
  );
}
