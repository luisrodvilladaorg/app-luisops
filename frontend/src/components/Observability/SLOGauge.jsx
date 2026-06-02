export default function SLOGauge({ target, current, met }) {
  const barWidth = Math.min(current, 100);
  const barColor = met ? 'bg-status-green' : 'bg-status-red';
  const textColor = met ? 'text-status-green' : 'text-status-red';

  return (
    <div className="rounded-lg border border-border bg-bg-card p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
        SLO Compliance
      </p>
      <p className={`mt-1 text-3xl font-bold ${textColor}`}>
        {current}
        <span className="ml-1 text-sm font-normal text-text-secondary">%</span>
      </p>

      <div className="mt-4">
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-border">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${barWidth}%` }}
          />
          <div
            className="absolute top-0 h-full w-0.5 bg-text-primary"
            style={{ left: `${target}%` }}
            title={`Target: ${target}%`}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-text-secondary">
          <span>
            Target:{' '}
            <span className="font-mono text-text-primary">{target}%</span>
          </span>
          <span className={`font-medium ${met ? 'text-status-green' : 'text-status-red'}`}>
            {met ? '\u2713 SLO met' : '\u2717 SLO breached'}
          </span>
        </div>
      </div>
    </div>
  );
}
