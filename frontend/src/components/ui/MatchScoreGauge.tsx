interface MatchScoreGaugeProps {
  score: number | null | undefined;
  size?: number;
}

function getColor(score: number) {
  if (score >= 75) return { stroke: "#10B981", glow: "rgba(16,185,129,0.4)" };
  if (score >= 50) return { stroke: "#F59E0B", glow: "rgba(245,158,11,0.4)" };
  return { stroke: "#F43F5E", glow: "rgba(244,63,94,0.4)" };
}

export default function MatchScoreGauge({ score, size = 120 }: MatchScoreGaugeProps) {
  const safeScore = score ?? 0;
  const r = 44;
  const cx = 56;
  const cy = 56;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - safeScore / 100);
  const { stroke, glow } = getColor(safeScore);

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 112 112" className="w-full h-full -rotate-90">
        {/* Track */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-ink-200 dark:text-navy-600"
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.6" />
            <stop offset="100%" stopColor={stroke} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Score arc */}
        {score != null && (
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            filter="url(#glow)"
            style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
          />
        )}
      </svg>
      {/* Score label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold font-display" style={{ color: stroke }}>
          {score != null ? `${Math.round(score)}` : "—"}
        </span>
        <span className="text-[10px] font-medium text-ink-400 dark:text-ink-500 uppercase tracking-wider">
          {score != null ? "Match" : "N/A"}
        </span>
      </div>
    </div>
  );
}
