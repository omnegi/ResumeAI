import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { CheckCircle2, Lightbulb, TriangleAlert, Wand2, ArrowLeft, RotateCcw } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import MatchScoreGauge from "@/components/ui/MatchScoreGauge";
import { listAnalyses } from "@/api/resume";
import type { Analysis } from "@/types";

function toLines(text: string | null): string[] {
  if (!text) return [];
  return text.split("\n").map((l) => l.replace(/^[-•]\s*/, "").trim()).filter(Boolean);
}

export default function AnalysisResults() {
  const { id } = useParams();
  const location = useLocation();
  const stateAnalysis = (location.state as { analysis?: Analysis } | undefined)?.analysis;
  const [analysis, setAnalysis] = useState<Analysis | null>(stateAnalysis || null);
  const [isLoading, setIsLoading] = useState(!stateAnalysis);

  useEffect(() => {
    if (stateAnalysis) return;
    listAnalyses().then((all) => setAnalysis(all.find((a) => a.id === Number(id)) || null)).finally(() => setIsLoading(false));
  }, [id, stateAnalysis]);

  if (isLoading) return (
    <AppShell>
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent-500 border-t-transparent" />
          <p className="text-sm text-ink-500">Loading analysis…</p>
        </div>
      </div>
    </AppShell>
  );

  if (!analysis) return (
    <AppShell>
      <Card className="p-12 text-center">
        <p className="text-ink-500 dark:text-ink-400">Analysis not found.</p>
        <Link to="/upload" className="mt-4 inline-block text-accent-400 hover:text-accent-300">Run a new analysis</Link>
      </Card>
    </AppShell>
  );

  const strengths  = toLines(analysis.strengths);
  const gaps       = toLines(analysis.gaps);
  const suggestions = toLines(analysis.suggestions);
  const weaknesses  = toLines(analysis.weaknesses);
  const matchingSkills = toLines(analysis.matching_skills);
  const missingSkills = toLines(analysis.missing_skills);
  const upskilling = toLines(analysis.upskilling_resources);

  // Safe parsing of the new detailed review JSON
  let parsedReview: {
    recruiter_summary?: string;
    formatting_score?: number;
    formatting_details?: string[];
    impact_score?: number;
    impact_details?: string[];
    keyword_density?: Array<{ keyword: string; count: number; importance: string }>;
  } = {};

  try {
    if (analysis.detailed_review) {
      parsedReview = JSON.parse(analysis.detailed_review);
    }
  } catch (e) {
    console.error("Failed to parse detailed review JSON", e);
  }

  const score      = analysis.match_score;
  const isStrong   = score != null && score >= 75;
  const isDecent   = score != null && score >= 50;

  return (
    <AppShell>
      <div className="animate-slide-up">
        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-2">
          <Link to="/upload" className="flex items-center gap-1.5 text-xs text-ink-400 hover:text-accent-400 transition-colors">
            <ArrowLeft size={13} /> Back to Analyzer
          </Link>
          <span className="text-ink-300 dark:text-white/20">/</span>
          <span className="text-xs text-ink-500">Analysis Results</span>
        </div>

        {/* Hero score card */}
        <div className="mb-6 relative overflow-hidden rounded-2xl p-6
          bg-gradient-to-r from-navy-800 to-navy-700
          dark:from-navy-800 dark:to-navy-700
          bg-white dark:bg-transparent
          border border-ink-200/60 dark:border-white/[0.07]
          shadow-card dark:shadow-cardDark"
        >
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent-500/10 blur-3xl" />
          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <MatchScoreGauge score={score} size={130} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-400">Match Analysis</p>
              <h1 className="mt-1 font-display text-xl font-bold text-ink-900 dark:text-ink-100">
                {isStrong ? "Strong match for this role! 🎉"
                  : isDecent ? "Decent match — a few gaps to close"
                  : "This resume needs work for this role"}
              </h1>
              <p className="mt-2 text-sm text-ink-500 dark:text-ink-400 max-w-lg">
                {isStrong
                  ? "Your resume is an excellent fit. Minor tweaks could push it even higher."
                  : isDecent
                  ? "You have relevant experience but some key skills are missing."
                  : "Consider tailoring your resume with the AI suggestions below."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to="/upload"><Button size="sm" variant="outline"><RotateCcw size={13} /> Re-analyze</Button></Link>
                <Link to="/builder"><Button size="sm"><Wand2 size={13} /> Build Optimized Resume</Button></Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recruiter Summary Card */}
        {parsedReview.recruiter_summary && (
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-accent-500/10 via-blue-500/5 to-transparent border border-accent-500/20 p-5">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-accent-400 mb-2 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent-400 animate-pulse" />
              Recruiter's Executive Summary
            </h3>
            <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed italic">
              "{parsedReview.recruiter_summary}"
            </p>
          </div>
        )}

        {/* ATS & Content Audits */}
        {parsedReview.formatting_score !== undefined && (
          <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Formatting Card */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500/10 text-accent-400 text-xs font-bold font-mono">
                    {parsedReview.formatting_score}%
                  </span>
                  <h3 className="font-display font-bold text-ink-900 dark:text-ink-100">ATS Formatting Check</h3>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  (parsedReview.formatting_score ?? 0) >= 80 ? "bg-good/10 text-good" : "bg-warn/10 text-warn"
                }`}>
                  {(parsedReview.formatting_score ?? 0) >= 80 ? "ATS Ready" : "Optimization Needed"}
                </span>
              </div>
              <ul className="space-y-2">
                {parsedReview.formatting_details?.map((d, i) => (
                  <li key={i} className="flex gap-2 text-xs text-ink-600 dark:text-ink-400">
                    <span className="text-good font-bold">✓</span>
                    {d}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Impact & Accomplishments Card */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-good/10 text-good dark:text-goodDark text-xs font-bold font-mono">
                    {parsedReview.impact_score ?? 0}%
                  </span>
                  <h3 className="font-display font-bold text-ink-900 dark:text-ink-100">Accomplishments & Impact</h3>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  (parsedReview.impact_score ?? 0) >= 80 ? "bg-good/10 text-good" : "bg-warn/10 text-warn"
                }`}>
                  {(parsedReview.impact_score ?? 0) >= 80 ? "Strong Metrics" : "Needs Quantifying"}
                </span>
              </div>
              <ul className="space-y-2">
                {parsedReview.impact_details?.map((d, i) => (
                  <li key={i} className="flex gap-2 text-xs text-ink-600 dark:text-ink-400">
                    <span className="text-accent-400 font-bold">→</span>
                    {d}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        {/* Detail grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Strengths */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-good/10 border border-good/20">
                <CheckCircle2 size={15} className="text-good dark:text-goodDark" />
              </div>
              <h3 className="font-display font-bold text-ink-900 dark:text-ink-100">Strengths</h3>
              <span className="ml-auto text-xs font-semibold bg-good/10 text-good dark:text-goodDark px-2 py-0.5 rounded-full border border-good/20">
                {strengths.length}
              </span>
            </div>
            <ul className="space-y-2.5">
              {strengths.length ? strengths.map((s, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-ink-700 dark:text-ink-300">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-good dark:bg-goodDark" />
                  {s}
                </li>
              )) : <li className="text-sm text-ink-400">No specific strengths flagged.</li>}
            </ul>
          </Card>

          {/* Gaps */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warn/10 border border-warn/20">
                <TriangleAlert size={15} className="text-warn dark:text-warnDark" />
              </div>
              <h3 className="font-display font-bold text-ink-900 dark:text-ink-100">Gaps</h3>
              <span className="ml-auto text-xs font-semibold bg-warn/10 text-warn dark:text-warnDark px-2 py-0.5 rounded-full border border-warn/20">
                {gaps.length}
              </span>
            </div>
            <ul className="space-y-2.5">
              {gaps.length ? gaps.map((g, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-ink-700 dark:text-ink-300">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-warn dark:bg-warnDark" />
                  {g}
                </li>
              )) : <li className="text-sm text-ink-400">No major gaps found.</li>}
            </ul>
          </Card>

          {/* AI Suggestions */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500/10 border border-accent-500/20">
                <Lightbulb size={15} className="text-accent-400" />
              </div>
              <h3 className="font-display font-bold text-ink-900 dark:text-ink-100">AI Suggestions</h3>
            </div>
            <ul className="space-y-3">
              {suggestions.length ? suggestions.map((s, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-ink-700 dark:text-ink-300">
                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent-500/15 text-[9px] font-bold text-accent-400">
                    {i + 1}
                  </span>
                  {s}
                </li>
              )) : <li className="text-sm text-ink-400">No suggestions available.</li>}
            </ul>
          </Card>
        </div>

        {/* Extended analysis grid */}
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Skills Breakdown */}
          <Card className="p-5">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-4">Skills Matching Analysis</h3>
            
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-good dark:text-goodDark uppercase tracking-wider mb-2">Matching Skills ({matchingSkills.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {matchingSkills.length ? matchingSkills.map((sk, i) => (
                    <span key={i} className="px-2.5 py-1 text-xs rounded-full font-medium bg-good/10 text-good dark:text-goodDark border border-good/20">
                      {sk}
                    </span>
                  )) : <span className="text-xs text-ink-400">No matched skills detected.</span>}
                </div>
              </div>

              <div className="pt-3 border-t border-ink-100 dark:border-white/[0.06]">
                <p className="text-xs font-semibold text-bad uppercase tracking-wider mb-2">Missing Skills ({missingSkills.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {missingSkills.length ? missingSkills.map((sk, i) => (
                    <span key={i} className="px-2.5 py-1 text-xs rounded-full font-medium bg-bad/10 text-bad border border-bad/20 animate-pulse">
                      {sk}
                    </span>
                  )) : <span className="text-xs text-ink-400">Perfect skill match! No missing skills.</span>}
                </div>
              </div>
            </div>
          </Card>

          {/* Weaknesses Analysis */}
          <Card className="p-5">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-4">Identified Weaknesses</h3>
            <ul className="space-y-2.5">
              {weaknesses.length ? weaknesses.map((w, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-ink-700 dark:text-ink-300">
                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-bad/10 text-[9px] font-bold text-bad">
                    ✕
                  </span>
                  {w}
                </li>
              )) : <li className="text-sm text-ink-400">No major weaknesses identified.</li>}
            </ul>
          </Card>
        </div>

        {/* Job Keyword Optimization Matrix */}
        {parsedReview.keyword_density && parsedReview.keyword_density.length > 0 && (
          <div className="mt-6">
            <Card className="p-5 overflow-hidden">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-4">Job Keyword Matrix & Optimization</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-ink-100 dark:border-white/[0.06]">
                      <th className="pb-2 font-bold uppercase tracking-wider text-ink-400">Target Keyword</th>
                      <th className="pb-2 font-bold uppercase tracking-wider text-ink-400">Resume Count</th>
                      <th className="pb-2 font-bold uppercase tracking-wider text-ink-400">Required Importance</th>
                      <th className="pb-2 font-bold uppercase tracking-wider text-ink-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedReview.keyword_density.map((kw, i) => {
                      const isOptimized = kw.count > 0;
                      return (
                        <tr key={i} className="border-b border-ink-50 dark:border-white/[0.03] last:border-0 hover:bg-ink-50/50 dark:hover:bg-navy-700/20">
                          <td className="py-2.5 font-medium text-ink-800 dark:text-ink-200">{kw.keyword}</td>
                          <td className="py-2.5 font-mono text-ink-600 dark:text-ink-400">{kw.count} times</td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                              kw.importance === "high" ? "bg-bad/10 text-bad" : "bg-accent-500/10 text-accent-400"
                            }`}>
                              {kw.importance}
                            </span>
                          </td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              isOptimized ? "bg-good/10 text-good" : "bg-warn/10 text-warn"
                            }`}>
                              {isOptimized ? "Optimized" : "Missing / Add"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Upskilling Recommendations */}
        <div className="mt-6">
          <Card className="p-5">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-4">Upskilling Recommendations & Resources</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {upskilling.length ? upskilling.map((up, i) => {
                const parts = up.split(":");
                const skill = parts[0] || "";
                const recommendation = parts.slice(1).join(":") || "";
                
                return (
                  <div key={i} className="p-3.5 rounded-xl bg-ink-50 dark:bg-navy-700/40 border border-ink-100 dark:border-white/[0.05] hover:border-accent-500/30 transition-all duration-300">
                    <p className="text-sm font-bold text-ink-800 dark:text-ink-100 mb-1">{skill.trim()}</p>
                    <p className="text-xs text-ink-500 dark:text-ink-400 leading-relaxed mb-3">{recommendation.trim()}</p>
                    <a 
                      href={`https://www.google.com/search?q=learn+${encodeURIComponent(skill.trim())}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-semibold text-accent-400 hover:text-accent-300 transition-colors"
                    >
                      Search Courses &rarr;
                    </a>
                  </div>
                );
              }) : (
                <div className="col-span-2 text-center py-6">
                  <p className="text-sm text-ink-500 dark:text-ink-400">All matching skills met. No extra courses needed!</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Bottom actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/cover-letter">
            <Button variant="outline">Generate Cover Letter</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost">← Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
