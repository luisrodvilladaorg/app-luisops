import { AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

const COLOR_MAP = {
  blue: { stroke: '#1f6feb', fill: '#58a6ff' },
  red: { stroke: '#cf222e', fill: '#f85149' },
  yellow: { stroke: '#bf8700', fill: '#d29922' },
  green: { stroke: '#2da44e', fill: '#3fb950' },
};

function formatTooltipTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const { timestamp, value } = payload[0].payload;
  return (
    <div className="rounded-md border border-border bg-bg-card px-3 py-2 text-xs shadow-lg">
      <p className="text-text-secondary">{formatTooltipTime(timestamp)}</p>
      <p className="font-mono font-bold text-text-primary">{value}</p>
    </div>
  );
}

export default function MetricCard({ title, value, unit, data, color = 'blue' }) {
  const colors = COLOR_MAP[color] || COLOR_MAP.blue;

  return (
    <div className="rounded-lg border border-border bg-bg-card p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
        {title}
      </p>
      <p className="mt-1 text-3xl font-bold" style={{ color: colors.stroke }}>
        {value}
        <span className="ml-1 text-sm font-normal text-text-secondary">{unit}</span>
      </p>

      {data && data.length > 0 && (
        <div className="mt-4 h-20">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.fill} stopOpacity={0.55} />
                  <stop offset="100%" stopColor={colors.fill} stopOpacity={0.12} />
                </linearGradient>
              </defs>
              <XAxis dataKey="timestamp" hide />
              <CartesianGrid stroke="rgba(148, 163, 184, 0.2)" vertical={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={colors.stroke}
                strokeWidth={2.5}
                fill={`url(#gradient-${color})`}
                dot={false}
                animationDuration={500}
                style={{ filter: `drop-shadow(0 0 4px ${colors.stroke})` }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
