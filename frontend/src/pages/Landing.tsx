import { Link, useNavigate } from "react-router-dom";
import {
  BrainCircuit, Sparkles, FileText, Target, CheckCircle2,
  ArrowRight, Star, Upload, Zap, TrendingUp, Shield,
  ChevronRight, Menu, X, BarChart3, PenLine, Layers, MessageSquare
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { Sun, Moon } from "lucide-react";
import { Animate, CountUp, Parallax } from "@/components/ui/Animate";

// ─── Data ──────────────────────────────────────────────────────────────────

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
];

const stats = [
  { value: "50K+", label: "Resumes Analyzed" },
  { value: "92%", label: "Avg. Match Accuracy" },
  { value: "3×", label: "More Interviews" },
  { value: "10 sec", label: "Analysis Time" },
];

const features = [
  {
    icon: BrainCircuit,
    title: "RAG-Powered Analysis",
    desc: "Our retrieval-augmented AI reads your resume like a recruiter, extracting every signal that matters.",
    color: "from-accent-600 to-accent-400",
    glow: "rgba(99,102,241,0.2)",
    path: "/upload",
  },
  {
    icon: Target,
    title: "Job Match Scoring",
    desc: "Paste any job description and instantly get a match score with a breakdown of strengths and gaps.",
    color: "from-blue-600 to-blue-400",
    glow: "rgba(59,130,246,0.2)",
    path: "/upload",
  },
  {
    icon: PenLine,
    title: "AI Resume Builder",
    desc: "Generate a tailored, polished resume from scratch. The AI handles formatting, tone, and keywords.",
    color: "from-violet-600 to-violet-400",
    glow: "rgba(139,92,246,0.2)",
    path: "/builder",
  },
  {
    icon: MessageSquare,
    title: "Interactive Resume Tailor",
    desc: "Chat with a stateful AI resume agent to edit, expand, or customize specific sections dynamically.",
    color: "from-orange-500 to-amber-400",
    glow: "rgba(245,158,11,0.2)",
    path: "/tailor",
  },
  {
    icon: Sparkles,
    title: "Cover Letter Generator",
    desc: "One click to generate a role-specific cover letter that sounds human, not generic.",
    color: "from-fuchsia-600 to-pink-400",
    glow: "rgba(192,38,211,0.2)",
    path: "/cover-letter",
  },
  {
    icon: BarChart3,
    title: "Career Dashboard",
    desc: "Track every application, score, and improvement suggestion in one beautiful overview.",
    color: "from-emerald-600 to-teal-400",
    glow: "rgba(16,185,129,0.2)",
    path: "/dashboard",
  },
];

const steps = [
  {
    num: "01",
    icon: Upload,
    title: "Upload Your Resume",
    desc: "Drag and drop your PDF, DOCX, or TXT. We extract and index every detail in seconds.",
  },
  {
    num: "02",
    icon: Zap,
    title: "Paste a Job Description",
    desc: "Add any job posting. Our RAG pipeline compares your profile against the role requirements instantly.",
  },
  {
    num: "03",
    icon: TrendingUp,
    title: "Get Actionable Results",
    desc: "Receive a match score, a list of strengths, skill gaps, and concrete AI suggestions to close them.",
  },
];

const testimonials = [
  {
    name: "Arjun Mehta",
    role: "Software Engineer at Google",
    text: "ResumeAI completely changed how I apply for jobs. I went from 1 interview per 20 applications to 1 in 4. The gap analysis is incredibly precise.",
    rating: 5,
    avatar: "AM",
    color: "from-accent-600 to-accent-400",
  },
  {
    name: "Priya Sharma",
    role: "Product Manager at Flipkart",
    text: "The cover letter generator saved me hours every week. Each letter actually sounds like me, tailored to the role. Got my dream job in 3 weeks.",
    rating: 5,
    avatar: "PS",
    color: "from-violet-600 to-fuchsia-400",
  },
  {
    name: "Rahul Verma",
    role: "Data Scientist at Microsoft",
    text: "The match score feature helped me understand exactly what skills I was missing. I upskilled on two things the AI flagged and landed the role.",
    rating: 5,
    avatar: "RV",
    color: "from-blue-600 to-cyan-400",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    desc: "Perfect to get started.",
    features: ["3 resume analyses/month", "Basic match scoring", "1 cover letter/month", "Resume history"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "₹299",
    period: "/ month",
    desc: "For serious job seekers.",
    features: ["Unlimited analyses", "Deep gap analysis + suggestions", "Unlimited cover letters", "AI Resume Builder", "Priority processing", "Export to PDF"],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Team",
    price: "₹799",
    period: "/ month",
    desc: "For placement cells & coaches.",
    features: ["Everything in Pro", "Up to 10 members", "Bulk resume analysis", "Team dashboard", "API access", "Dedicated support"],
    cta: "Contact Us",
    highlighted: false,
  },
];

// ─── Components ────────────────────────────────────────────────────────────

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      {/* Floating pill */}
      <div
        className={`
          flex w-full max-w-4xl items-center justify-between
          rounded-full px-3 py-2
          transition-all duration-500
          ${scrolled
            ? "bg-ink-900/95 dark:bg-navy-800/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
            : "bg-ink-900/90 dark:bg-navy-800/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
          }
        `}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 pl-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-500 to-accent-600">
            <BrainCircuit size={16} className="text-white" />
          </div>
          <span className="font-display text-sm font-bold text-white">ResumeAI</span>
        </Link>

        {/* Desktop nav links — centered */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={toggle}
            className="rounded-full p-2 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            {theme === "dark" ? <Sun size={15} className="text-warn" /> : <Moon size={15} />}
          </button>
          <Link
            to="/login"
            className="rounded-full px-4 py-1.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 px-5 py-2 text-sm font-semibold text-white hover:from-accent-400 hover:to-accent-500 hover:shadow-glow transition-all duration-200"
          >
            Get Started <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden rounded-full p-2 text-white/70 hover:bg-white/10"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown — appears below the pill */}
      {menuOpen && (
        <div className="absolute top-[72px] left-4 right-4 mx-auto max-w-4xl rounded-2xl bg-ink-900/95 dark:bg-navy-800/95 backdrop-blur-xl border border-white/[0.08] px-5 py-4 space-y-2 md:hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <div className="flex gap-2 pt-2 border-t border-white/[0.08]">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="flex-1 rounded-full border border-white/20 py-2.5 text-center text-sm font-medium text-white/80"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="flex-1 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 py-2.5 text-center text-sm font-semibold text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCardClick = (path: string) => {
    if (user) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-navy-900 font-body overflow-x-hidden">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background blobs */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-accent-500/10 dark:bg-accent-500/5 blur-3xl" />
        <div className="pointer-events-none absolute top-20 right-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <Animate variant="fadeDown" delay={100}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-500/20 bg-accent-500/8 px-4 py-1.5 dark:bg-accent-500/10">
                <Sparkles size={13} className="text-accent-400" />
                <span className="text-xs font-semibold text-accent-600 dark:text-accent-300">Powered by Groq LLM + RAG</span>
              </div>
            </Animate>

            {/* Headline */}
            <Animate variant="blurIn" delay={250} duration={900}>
              <h1 className="font-display text-5xl font-extrabold leading-tight text-ink-900 dark:text-ink-50 sm:text-6xl lg:text-7xl max-w-4xl">
                Transform Your{" "}
                <span className="bg-gradient-to-r from-accent-500 via-violet-500 to-blue-500 bg-clip-text text-transparent">
                  Job Search
                </span>{" "}
                with AI
              </h1>
            </Animate>

            <Animate variant="fadeUp" delay={450}>
              <p className="mt-6 max-w-2xl text-lg text-ink-500 dark:text-ink-400 leading-relaxed">
                Upload your resume, paste a job description, and get an instant AI-powered match score, gap analysis, and tailored suggestions — all in under 10 seconds.
              </p>
            </Animate>

            {/* CTAs */}
            <Animate variant="fadeUp" delay={600}>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
                <Link to="/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent-600 to-accent-500 px-8 py-4 text-base font-semibold text-white shadow-pop hover:-translate-y-1 hover:shadow-glow transition-all duration-200">
                  Start for Free <ArrowRight size={18} />
                </Link>
                <a href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-2xl border border-ink-200 dark:border-white/10 px-8 py-4 text-base font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-navy-800 transition-all duration-200">
                  See How It Works
                </a>
              </div>
            </Animate>

            {/* Trust line */}
            <Animate variant="fadeIn" delay={800}>
              <p className="mt-5 text-sm text-ink-400 dark:text-ink-500">
                ✓ No credit card required &nbsp;·&nbsp; ✓ Free forever plan &nbsp;·&nbsp; ✓ Setup in 30 seconds
              </p>
            </Animate>
          </div>

          {/* Hero visual — dashboard mockup card */}
          <Animate variant="scaleUp" delay={400} duration={1000}>
          <Parallax speed={0.4}>
          <div className="relative mt-16 mx-auto max-w-4xl">
            <div className="rounded-3xl bg-white dark:bg-navy-800 border border-ink-100 dark:border-white/[0.07] shadow-[0_20px_80px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.5)] overflow-hidden p-6">
              {/* Fake browser bar */}
              <div className="flex items-center gap-2 mb-5">
                <div className="h-3 w-3 rounded-full bg-bad/60" />
                <div className="h-3 w-3 rounded-full bg-warn/60" />
                <div className="h-3 w-3 rounded-full bg-good/60" />
                <div className="ml-4 flex-1 rounded-lg bg-ink-100 dark:bg-navy-700 px-3 py-1 text-xs text-ink-400">
                  app.resumeai.io/dashboard
                </div>
              </div>

              {/* Mock dashboard UI */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                  { label: "Resumes Analyzed", val: "128", color: "text-accent-400" },
                  { label: "Avg. Match Score", val: "76%", color: "text-good" },
                  { label: "CVs Generated", val: "34", color: "text-violet-400" },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl bg-ink-50 dark:bg-navy-700/60 border border-ink-100 dark:border-white/[0.05] p-4">
                    <p className={`font-display text-2xl font-bold ${s.color}`}>{s.val}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-wide text-ink-400">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-ink-50 dark:bg-navy-700/50 border border-ink-100 dark:border-white/[0.05] p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-ink-700 dark:text-ink-300">Recent Analyses</p>
                  <span className="text-[10px] text-accent-400">View all →</span>
                </div>
                {[
                  { name: "Senior Engineer Resume", score: "89%", color: "text-good bg-good/10" },
                  { name: "PM Role Application", score: "72%", color: "text-warn bg-warn/10" },
                  { name: "Data Scientist CV", score: "61%", color: "text-warn bg-warn/10" },
                ].map((r) => (
                  <div key={r.name} className="flex items-center justify-between py-2 border-b border-ink-100 dark:border-white/[0.04] last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-lg bg-accent-500/10 flex items-center justify-center">
                        <FileText size={10} className="text-accent-400" />
                      </div>
                      <span className="text-xs text-ink-600 dark:text-ink-300">{r.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.color}`}>{r.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -left-8 top-12 hidden animate-float lg:block">
              <div className="rounded-2xl bg-white dark:bg-navy-800 border border-ink-100 dark:border-white/10 shadow-card p-3 flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-good/10 flex items-center justify-center">
                  <CheckCircle2 size={16} className="text-good" />
                </div>
                <div>
                  <p className="text-[10px] text-ink-400">Match Score</p>
                  <p className="text-sm font-bold text-good">92% Strong</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-8 top-20 hidden lg:block" style={{ animationDelay: "2s" }}>
              <div className="rounded-2xl bg-white dark:bg-navy-800 border border-ink-100 dark:border-white/10 shadow-card p-3 flex items-center gap-2 animate-float">
                <div className="h-8 w-8 rounded-xl bg-accent-500/10 flex items-center justify-center">
                  <Zap size={16} className="text-accent-400" />
                </div>
                <div>
                  <p className="text-[10px] text-ink-400">Analysis Time</p>
                  <p className="text-sm font-bold text-ink-900 dark:text-ink-100">8.3 seconds</p>
                </div>
              </div>
            </div>
          </div>
          </Parallax>
          </Animate>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────────────── */}
      <section className="border-y border-ink-100 dark:border-white/[0.06] bg-ink-50 dark:bg-navy-800/50 py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((s, i) => (
              <Animate key={s.label} variant="fadeUp" delay={i * 150}>
                <div className="flex flex-col items-center text-center">
                  <span className="font-display text-3xl font-extrabold bg-gradient-to-r from-accent-500 to-violet-500 bg-clip-text text-transparent">
                    {s.value.match(/\d+/) ? (
                      <CountUp
                        end={parseInt(s.value.match(/\d+/)![0])}
                        suffix={s.value.replace(/[\d]/g, "")}
                        className="font-display text-3xl font-extrabold bg-gradient-to-r from-accent-500 to-violet-500 bg-clip-text text-transparent"
                      />
                    ) : s.value}
                  </span>
                  <span className="mt-1 text-sm text-ink-500 dark:text-ink-400">{s.label}</span>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────────────────────────────────── */}
      <section className="bg-navy-900 dark:bg-[#040914] py-20 overflow-hidden relative">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent-900/30 via-transparent to-blue-900/20" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <Animate variant="fadeLeft" duration={800}>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/20 bg-accent-500/10 px-4 py-1.5 mb-6">
                <span className="text-xs font-semibold text-accent-400">The Problem</span>
              </div>
              <h2 className="font-display text-4xl font-extrabold text-white leading-tight">
                Job Applications Are Harder Than They Should Be
              </h2>
              <p className="mt-4 text-ink-400 leading-relaxed">
                Most resumes get rejected by ATS software before a human ever reads them. You don't know why. You don't know what to fix. We change that.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "75% of resumes are rejected by ATS before a recruiter sees them",
                  "Average job seeker sends 50+ applications without knowing what's wrong",
                  "Generic cover letters are ignored — personalization is everything",
                  "Skills gaps are invisible without a benchmark to measure against",
                ].map((p, i) => (
                  <Animate key={p} variant="fadeLeft" delay={200 + i * 120}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-bad/20 flex items-center justify-center">
                        <span className="text-[10px] text-bad font-bold">✕</span>
                      </div>
                      <p className="text-sm text-ink-300">{p}</p>
                    </div>
                  </Animate>
                ))}
              </div>
            </div>
            </Animate>

            {/* Right panel: solution callouts */}
            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: BrainCircuit, title: "AI sees what recruiters see", desc: "Our model analyzes your resume the same way ATS and hiring managers do.", color: "text-accent-400 bg-accent-500/10 border-accent-500/20" },
                { icon: Target, title: "Precise gap identification", desc: "Know exactly which skills, keywords, and experience are missing — and fix them.", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                { icon: Sparkles, title: "Personalized, not generic", desc: "Every suggestion and cover letter is tailored to the specific role you're applying for.", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
              ].map((s, i) => (
                <Animate key={s.title} variant="fadeRight" delay={i * 150}>
                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-5 hover:bg-white/[0.07] transition-colors">
                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${s.color} mb-3`}>
                      <s.icon size={18} />
                    </div>
                    <h4 className="font-display font-bold text-white">{s.title}</h4>
                    <p className="mt-1 text-sm text-ink-400">{s.desc}</p>
                  </div>
                </Animate>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Animate variant="fadeUp">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/20 bg-accent-500/8 dark:bg-accent-500/10 px-4 py-1.5 mb-4">
                <Layers size={13} className="text-accent-400" />
                <span className="text-xs font-semibold text-accent-600 dark:text-accent-300">Everything You Need</span>
              </div>
              <h2 className="font-display text-4xl font-extrabold text-ink-900 dark:text-ink-50">
                AI-Powered Platform to Supercharge Your Career
              </h2>
              <p className="mt-3 text-ink-500 dark:text-ink-400 max-w-xl mx-auto">
                One platform that replaces 5 separate tools — resume review, job matching, CV writing, cover letters, and career tracking.
              </p>
            </div>
          </Animate>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Animate key={f.title} variant="fadeUp" delay={i * 100}>
                <div
                  onClick={() => handleCardClick(f.path)}
                  className="group relative rounded-2xl border border-ink-100 dark:border-white/[0.07] bg-white dark:bg-navy-800 p-6 hover:-translate-y-1 transition-all duration-200 hover:shadow-pop overflow-hidden cursor-pointer"
                  style={{ "--glow": f.glow } as React.CSSProperties}
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"
                    style={{ background: f.glow }} />
                  <div className={`relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} mb-4`}>
                    <f.icon size={22} className="text-white" />
                  </div>
                  <h3 className="relative font-display font-bold text-ink-900 dark:text-ink-100">{f.title}</h3>
                  <p className="relative mt-2 text-sm text-ink-500 dark:text-ink-400 leading-relaxed">{f.desc}</p>
                  <div className="relative mt-4 flex items-center gap-1 text-xs font-semibold text-accent-500 dark:text-accent-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ChevronRight size={12} />
                  </div>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-ink-50 dark:bg-navy-800/40">
        <div className="mx-auto max-w-7xl px-6">
          <Animate variant="fadeUp">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/20 bg-accent-500/8 dark:bg-accent-500/10 px-4 py-1.5 mb-4">
                <Zap size={13} className="text-accent-400" />
                <span className="text-xs font-semibold text-accent-600 dark:text-accent-300">How It Works</span>
              </div>
              <h2 className="font-display text-4xl font-extrabold text-ink-900 dark:text-ink-50">
                Get Results in 3 Simple Steps
              </h2>
              <p className="mt-3 text-ink-500 dark:text-ink-400">From upload to actionable insights in under 30 seconds.</p>
            </div>
          </Animate>

          <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Connector line */}
            <div className="pointer-events-none absolute top-16 left-1/6 right-1/6 hidden h-px bg-gradient-to-r from-transparent via-accent-500/30 to-transparent lg:block" />
            {steps.map((s, i) => (
              <Animate key={s.num} variant="scaleUp" delay={i * 200}>
                <div className="relative flex flex-col items-center text-center">
                  <div className="relative mb-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-600 to-accent-400 shadow-pop">
                      <s.icon size={26} className="text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-navy-800 border-2 border-accent-500 text-[10px] font-bold text-accent-500">
                      {i + 1}
                    </div>
                  </div>
                  <div className="absolute -top-1 left-0 text-[80px] font-extrabold text-ink-100 dark:text-navy-700/50 font-display leading-none select-none -z-10">
                    {s.num}
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink-900 dark:text-ink-100">{s.title}</h3>
                  <p className="mt-2 text-sm text-ink-500 dark:text-ink-400 max-w-xs">{s.desc}</p>
                </div>
              </Animate>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/register"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent-600 to-accent-500 px-8 py-4 text-base font-semibold text-white shadow-pop hover:-translate-y-1 hover:shadow-glow transition-all duration-200">
              Try It Now — It's Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Animate variant="fadeUp">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/20 bg-accent-500/8 dark:bg-accent-500/10 px-4 py-1.5 mb-4">
                <Star size={13} className="text-warn fill-warn" />
                <span className="text-xs font-semibold text-accent-600 dark:text-accent-300">Success Stories</span>
              </div>
              <h2 className="font-display text-4xl font-extrabold text-ink-900 dark:text-ink-50">
                Why Job Seekers Choose ResumeAI
              </h2>
              <p className="mt-3 text-ink-500 dark:text-ink-400">Real results from real people who landed their dream jobs.</p>
            </div>
          </Animate>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Animate key={t.name} variant="fadeUp" delay={i * 150}>
                <div
                  className="relative rounded-2xl bg-white dark:bg-navy-800 border border-ink-100 dark:border-white/[0.07] shadow-card dark:shadow-cardDark p-6 hover:-translate-y-1 transition-all duration-200">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={14} className="text-warn fill-warn" />
                    ))}
                  </div>
                  <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed italic">"{t.text}"</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-xs font-bold text-white`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">{t.name}</p>
                      <p className="text-xs text-ink-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────────────────
      <section id="pricing" className="py-20 bg-ink-50 dark:bg-navy-800/40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/20 bg-accent-500/8 dark:bg-accent-500/10 px-4 py-1.5 mb-4">
              <span className="text-xs font-semibold text-accent-600 dark:text-accent-300">Simple Pricing</span>
            </div>
            <h2 className="font-display text-4xl font-extrabold text-ink-900 dark:text-ink-50">
              Career Growth Made Simple
            </h2>
            <p className="mt-3 text-ink-500 dark:text-ink-400">Start free, upgrade when you're ready.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
            {pricingPlans.map((p) => (
              <div key={p.name}
                className={`relative rounded-2xl p-7 ${p.highlighted
                  ? "bg-gradient-to-b from-accent-600 to-accent-800 text-white shadow-glow scale-105"
                  : "bg-white dark:bg-navy-800 border border-ink-100 dark:border-white/[0.07] shadow-card dark:shadow-cardDark"
                }`}
              >
                {p.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-warn px-4 py-1 text-[11px] font-bold text-white shadow">
                    MOST POPULAR
                  </div>
                )}
                <p className={`text-sm font-semibold ${p.highlighted ? "text-accent-200" : "text-accent-500"}`}>{p.name}</p>
                <div className="mt-2 flex items-end gap-1">
                  <span className={`font-display text-4xl font-extrabold ${p.highlighted ? "text-white" : "text-ink-900 dark:text-ink-100"}`}>
                    {p.price}
                  </span>
                  <span className={`mb-1 text-sm ${p.highlighted ? "text-accent-200" : "text-ink-400"}`}>{p.period}</span>
                </div>
                <p className={`mt-1 text-sm ${p.highlighted ? "text-accent-200" : "text-ink-500 dark:text-ink-400"}`}>{p.desc}</p>

                <ul className="mt-6 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2 size={15} className={p.highlighted ? "text-accent-200" : "text-good"} />
                      <span className={p.highlighted ? "text-accent-50" : "text-ink-600 dark:text-ink-300"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/register"
                  className={`mt-7 block rounded-xl py-3 text-center text-sm font-semibold transition-all duration-200 ${p.highlighted
                    ? "bg-white text-accent-700 hover:bg-accent-50"
                    : "border border-accent-500/40 text-accent-500 dark:text-accent-300 hover:bg-accent-500/10"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Animate variant="scaleUp" duration={900}>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-accent-700 via-accent-600 to-violet-600 p-12 text-center text-white shadow-glow">
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="relative">
              <h2 className="font-display text-4xl font-extrabold">Ready to Land Your Dream Job?</h2>
              <p className="mt-3 text-accent-200 max-w-xl mx-auto">
                Join thousands of job seekers who use ResumeAI to apply smarter, get more interviews, and land better roles.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link to="/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-accent-700 hover:bg-accent-50 hover:-translate-y-0.5 transition-all duration-200">
                  Get Started Free <ArrowRight size={18} />
                </Link>
                <Link to="/login"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/30 px-8 py-4 text-base font-medium text-white hover:bg-white/10 transition-all duration-200">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
          </Animate>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-ink-100 dark:border-white/[0.06] bg-white dark:bg-navy-900 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-700">
                  <BrainCircuit size={18} className="text-white" />
                </div>
                <span className="font-display text-lg font-bold text-ink-900 dark:text-ink-100">ResumeAI</span>
              </Link>
              <p className="mt-3 text-sm text-ink-500 dark:text-ink-400 max-w-xs">
                AI-powered career tools that help you get more interviews and land better jobs.
              </p>
            </div>

            {/* Links */}
            {[
              { title: "Product", links: ["Features", "How It Works", "Pricing", "Changelog"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-xs font-bold uppercase tracking-widest text-ink-400 dark:text-ink-500 mb-3">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-ink-500 dark:text-ink-400 hover:text-accent-500 dark:hover:text-accent-300 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-ink-100 dark:border-white/[0.05] pt-6 sm:flex-row">
            <p className="text-xs text-ink-400">© {new Date().getFullYear()} ResumeAI. All rights reserved.</p>
            <p className="text-xs text-ink-400">Made with ❤️ for job seekers everywhere</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
