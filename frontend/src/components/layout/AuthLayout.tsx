import type { ReactNode } from "react";
import { FileText, Sparkles, Target, BrainCircuit } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  headline: string;
  subline: string;
}

const features = [
  { icon: BrainCircuit, label: "AI-powered resume analysis & scoring" },
  { icon: Target,       label: "Smart job description matching" },
  { icon: Sparkles,     label: "Instant cover letter generation" },
  { icon: FileText,     label: "Personalized resume builder" },
];

export default function AuthLayout({ children, headline, subline }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full font-body">
      {/* ── Left panel (dark always) ── */}
      <div className="auth-mesh relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 text-white lg:flex">
        {/* Floating blob decorations */}
        <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-accent-600/20 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-blue-600/15 blur-3xl animate-float" style={{ animationDelay: "3s" }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 shadow-pop">
            <BrainCircuit size={20} className="text-white" />
          </div>
          <span className="font-display text-xl font-bold">ResumeAI</span>
        </div>

        {/* Hero text */}
        <div className="relative max-w-md">
          <h1 className="font-display text-4xl font-extrabold leading-tight">
            {headline}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-300">
            {subline}
          </p>

          <div className="mt-10 space-y-4">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 group">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-500/15 border border-accent-500/20 group-hover:bg-accent-500/25 transition-colors">
                  <Icon size={16} className="text-accent-300" />
                </div>
                <span className="text-sm text-ink-300">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-ink-500">
          © {new Date().getFullYear()} ResumeAI — Your career, accelerated.
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex w-full flex-col justify-center bg-ink-50 dark:bg-navy-900 px-6 py-12 sm:px-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-700">
              <BrainCircuit size={16} className="text-white" />
            </div>
            <span className="font-display text-lg font-bold text-ink-900 dark:text-ink-100">ResumeAI</span>
          </div>

          {/* Form card */}
          <div className="rounded-2xl p-8 bg-white dark:bg-navy-800 border border-ink-200/60 dark:border-white/[0.07] shadow-card dark:shadow-cardDark">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
