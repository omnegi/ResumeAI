import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Sparkles, Target, UploadCloud, ArrowRight, TrendingUp } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import StatCard from "@/components/ui/StatCard";
import Button from "@/components/ui/Button";
import Badge, { scoreTone } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import { fetchDashboardSummary } from "@/api/dashboard";
import type { DashboardSummary } from "@/types";

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardSummary().then(setSummary).finally(() => setIsLoading(false));
  }, []);

  const firstName = user?.full_name?.split(" ")[0] || "there";

  return (
    <AppShell>
      {/* ── Welcome banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent-700 via-accent-600 to-blue-600 p-6 text-white">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 right-32 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-200">AI Resume Platform</p>
            <h1 className="mt-1 font-display text-2xl font-bold">Hello, {firstName} 👋</h1>
            <p className="mt-1 text-sm text-accent-100">Here's your resume activity overview</p>
          </div>
          <Link to="/upload">
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/15 whitespace-nowrap">
              <UploadCloud size={16} /> Analyze Resume
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={FileText}
          label="Resumes Analyzed"
          value={summary?.total_analyses ?? (isLoading ? "…" : 0)}
          trend={summary?.total_analyses ? "+12%" : undefined}
          trendUp
        />
        <StatCard
          icon={Target}
          label="Avg. Match Score"
          value={summary?.average_match_score != null ? `${summary.average_match_score}%` : "—"}
          trend={summary?.average_match_score ? "+5%" : undefined}
          trendUp
        />
        <StatCard
          icon={Sparkles}
          label="CVs Generated"
          value={summary?.total_cover_letters ?? (isLoading ? "…" : 0)}
        />
      </div>

      {/* ── Main grid ── */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent analyses table */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-navy-800 border border-ink-200/60 dark:border-white/[0.07] shadow-card dark:shadow-cardDark overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100 dark:border-white/[0.05]">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-accent-400" />
              <h2 className="font-display text-sm font-bold text-ink-900 dark:text-ink-100">Recent Analyses</h2>
            </div>
            <Link to="/upload" className="text-xs font-medium text-accent-400 hover:text-accent-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink-100 dark:border-white/[0.05]">
                  {["Resume", "Date", "Score", "Action"].map((h) => (
                    <th key={h} className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-ink-400 dark:text-ink-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {summary?.recent_analyses.length ? (
                  summary.recent_analyses.map((a) => (
                    <tr key={a.id} className="border-b border-ink-50 dark:border-white/[0.03] hover:bg-ink-50 dark:hover:bg-navy-700/40 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-500/10">
                            <FileText size={13} className="text-accent-400" />
                          </div>
                          <span className="font-medium text-ink-800 dark:text-ink-200">Resume #{a.resume_id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-ink-500 dark:text-ink-400 text-xs">
                        {new Date(a.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3">
                        <Badge tone={scoreTone(a.match_score)}>
                          {a.match_score != null ? `${Math.round(a.match_score)}%` : "—"}
                        </Badge>
                      </td>
                      <td className="px-6 py-3">
                        <Link to="/upload" className="text-xs font-medium text-accent-400 hover:text-accent-300 transition-colors">
                          Re-analyze →
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-500/10">
                          <FileText size={22} className="text-accent-400" />
                        </div>
                        <p className="text-sm text-ink-500 dark:text-ink-400">No analyses yet.</p>
                        <Link to="/upload">
                          <Button size="sm">Upload your first resume</Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex flex-col gap-4">
          {/* Resume Builder CTA */}
          <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-accent-900/80 to-navy-800 dark:from-navy-700 dark:to-navy-800 border border-accent-500/20">
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent-500/20 blur-2xl" />
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/20 border border-accent-500/30">
                <FileText size={18} className="text-accent-300" />
              </div>
              <h3 className="mt-3 font-display font-bold text-ink-100 dark:text-ink-100">Resume Builder</h3>
              <p className="mt-1 text-xs text-ink-400">Create a tailored resume from scratch using AI.</p>
              <Link to="/builder" className="mt-4 block">
                <Button className="w-full" size="sm">
                  Start Building <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </div>

          {/* CV Generator CTA */}
          <div className="relative overflow-hidden rounded-2xl p-5 bg-white dark:bg-navy-800 border border-ink-200/60 dark:border-white/[0.07]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-good/10 border border-good/20">
              <Sparkles size={18} className="text-good dark:text-goodDark" />
            </div>
            <h3 className="mt-3 font-display font-bold text-ink-900 dark:text-ink-100">CV Generator</h3>
            <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">Generate a professional cover letter with AI.</p>
            <Link to="/cover-letter" className="mt-4 block">
              <Button variant="outline" className="w-full" size="sm">
                Generate Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
