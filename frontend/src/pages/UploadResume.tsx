import { useCallback, useRef, useState, type DragEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FileCheck2, Lock, Sparkles, UploadCloud, X } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { uploadResume, analyzeResume } from "@/api/resume";

export default function UploadResume() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  }, []);

  async function handleAnalyze() {
    if (!file) { setError("Please choose a resume file first."); return; }
    setError("");
    setIsSubmitting(true);
    try {
      const resume = await uploadResume(file);
      const analysis = await analyzeResume(resume.id, jobDescription);
      navigate(`/results/${analysis.id}`, { state: { analysis } });
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl animate-slide-up">
        {/* Page header */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-400">AI Resume Analyzer</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink-900 dark:text-ink-100">
            Analyze Your Resume
          </h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            Upload your resume and optionally add a job description to get a match score.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Upload zone */}
          <Card className="p-6">
            <h2 className="mb-4 text-sm font-semibold text-ink-700 dark:text-ink-300 uppercase tracking-wide">
              Resume File
            </h2>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={`
                relative flex cursor-pointer flex-col items-center justify-center
                rounded-xl border-2 border-dashed px-6 py-10 text-center
                transition-all duration-200
                ${isDragging
                  ? "border-accent-500 bg-accent-500/10 scale-[1.01]"
                  : "border-ink-200 dark:border-white/[0.08] hover:border-accent-500/50 hover:bg-accent-500/5"
                }
              `}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              {file ? (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-good/10 border border-good/20">
                    <FileCheck2 size={26} className="text-good dark:text-goodDark" />
                  </div>
                  <p className="mt-3 font-semibold text-ink-800 dark:text-ink-200">{file.name}</p>
                  <p className="mt-1 text-xs text-ink-400">Click to choose a different file</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="mt-3 flex items-center gap-1 text-xs text-bad hover:text-bad/80 transition-colors"
                  >
                    <X size={12} /> Remove
                  </button>
                </>
              ) : (
                <>
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all ${isDragging ? "bg-accent-500/20 border-accent-500/40" : "bg-accent-500/10 border border-accent-500/20"}`}>
                    <UploadCloud size={26} className="text-accent-400" />
                  </div>
                  <p className="mt-3 font-semibold text-ink-700 dark:text-ink-300">
                    {isDragging ? "Drop it here!" : "Drag & drop your resume"}
                  </p>
                  <p className="mt-1 text-xs text-ink-400">PDF, DOCX, or TXT — Max 10MB</p>
                  <div className="mt-4 rounded-lg border border-accent-500/30 bg-accent-500/10 px-3 py-1.5 text-xs font-medium text-accent-400">
                    Browse files
                  </div>
                </>
              )}
            </div>

            {/* Trust badges */}
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              {[
                { icon: Lock, label: "Secure Upload" },
                { icon: Sparkles, label: "AI Analysis" },
                { icon: FileCheck2, label: "Multi-format" },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-[10px] text-ink-400 dark:text-ink-500 font-medium">
                  <Icon size={11} className="text-accent-400" /> {label}
                </span>
              ))}
            </div>
          </Card>

          {/* Job description */}
          <Card className="p-6">
            <h2 className="mb-4 text-sm font-semibold text-ink-700 dark:text-ink-300 uppercase tracking-wide">
              Job Description <span className="normal-case font-normal text-ink-400">(optional)</span>
            </h2>
            <Textarea
              placeholder="Paste the job description here to get an AI match score and tailored suggestions…"
              rows={10}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <p className="mt-2 text-xs text-ink-400 dark:text-ink-500">
              Adding a job description significantly improves AI match accuracy.
            </p>
          </Card>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-bad/10 border border-bad/20 px-4 py-3 text-sm text-bad">
            {error}
          </div>
        )}

        <div className="mt-6">
          <Button size="lg" className="w-full" isLoading={isSubmitting} onClick={handleAnalyze}>
            <Sparkles size={16} />
            {isSubmitting ? "Analyzing…" : "Analyze Resume with AI"}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
