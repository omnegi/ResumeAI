type Tone = "good" | "warn" | "bad" | "neutral";

export function scoreTone(score: number | null | undefined): Tone {
  if (score == null) return "neutral";
  if (score >= 75) return "good";
  if (score >= 50) return "warn";
  return "bad";
}

const tones: Record<Tone, string> = {
  good:    "bg-good/10 text-good dark:text-goodDark border border-good/20",
  warn:    "bg-warn/10 text-warn dark:text-warnDark border border-warn/20",
  bad:     "bg-bad/10 text-bad border border-bad/20",
  neutral: "bg-ink-100 dark:bg-navy-700 text-ink-500 dark:text-ink-400 border border-ink-200 dark:border-white/10",
};

export default function Badge({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}
