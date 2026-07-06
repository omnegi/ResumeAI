import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
}

export default function StatCard({ icon: Icon, label, value, trend, trendUp }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-5 transition-all duration-200
      bg-white dark:bg-navy-800
      border border-ink-200/60 dark:border-white/[0.07]
      shadow-card dark:shadow-cardDark
      hover:-translate-y-0.5 hover:shadow-pop group"
    >
      {/* Background glow blob */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent-500/10 blur-2xl transition-all duration-300 group-hover:bg-accent-500/20" />

      <div className="relative flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-500/10 dark:bg-accent-500/15 border border-accent-500/20">
          <Icon size={20} className="text-accent-400 dark:text-accent-300" />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            trendUp
              ? "bg-good/10 text-good dark:text-goodDark"
              : "bg-warn/10 text-warn dark:text-warnDark"
          }`}>
            {trend}
          </span>
        )}
      </div>

      <div className="relative mt-4">
        <p className="text-2xl font-bold font-display text-ink-900 dark:text-ink-100">
          {value}
        </p>
        <p className="mt-0.5 text-xs font-medium text-ink-500 dark:text-ink-400 uppercase tracking-wide">
          {label}
        </p>
      </div>
    </div>
  );
}
