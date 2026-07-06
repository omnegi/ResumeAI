import { useEffect, useState } from "react";
import { Download, Sparkles, FileText } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { listResumes } from "@/api/resume";
import { generateCoverLetter } from "@/api/coverLetter";
import { resumeDownloadUrl } from "@/api/builder";
import type { CoverLetterOut, Resume } from "@/types";

export default function CoverLetterGenerator() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [resumeId, setResumeId] = useState<number | "">("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<CoverLetterOut | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { listResumes().then(setResumes); }, []);

  async function handleSubmit() {
    setError("");
    if (!resumeId) { setError("Please select a resume first."); return; }
    if (!jobDescription) { setError("Please paste the job description."); return; }
    setIsSubmitting(true);
    try {
      setResult(await generateCoverLetter({ resume_id: Number(resumeId), job_description: jobDescription, company_name: companyName || undefined }));
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Could not generate cover letter.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppShell>
      <div className="animate-slide-up">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent-400">AI CV Generator</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-ink-900 dark:text-ink-100">Cover Letter Generator</h1>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
          Pick a resume, paste the job description, and get a tailored cover letter.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Form */}
          <Card className="p-5 space-y-4">
            {/* Resume select */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
                Resume
              </label>
              <select
                className="w-full rounded-xl px-3.5 py-2.5 text-sm
                  bg-ink-50 dark:bg-navy-700/50
                  border border-ink-200 dark:border-white/[0.08]
                  text-ink-900 dark:text-ink-100
                  focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20
                  transition-all duration-200"
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value ? Number(e.target.value) : "")}
              >
                <option value="">Select a resume…</option>
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.filename || `Resume #${r.id}`} ({r.source})
                  </option>
                ))}
              </select>
              {resumes.length === 0 && (
                <p className="mt-1.5 text-xs text-ink-400">No resumes yet — upload or build one first.</p>
              )}
            </div>

            <Input
              label="Company Name (optional)"
              placeholder="e.g. Acme Corp"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />

            <Textarea
              label="Job Description"
              rows={9}
              placeholder="Paste the full job description here…"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            {error && (
              <div className="rounded-xl bg-bad/10 border border-bad/20 px-4 py-3 text-sm text-bad">{error}</div>
            )}

            <Button className="w-full" size="lg" isLoading={isSubmitting} onClick={handleSubmit}>
              <Sparkles size={16} /> Generate Cover Letter
            </Button>
          </Card>

          {/* Preview */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100 dark:border-white/[0.06]">
              <h3 className="font-display font-bold text-ink-900 dark:text-ink-100">Preview</h3>
              {result && (
                <a href={resumeDownloadUrl(result.pdf_download_url)} target="_blank" rel="noreferrer">
                  <Button size="sm" variant="outline">
                    <Download size={13} /> Download PDF
                  </Button>
                </a>
              )}
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-5">
              {result ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-700 dark:text-ink-300">
                  {result.content}
                </p>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-500/10 border border-accent-500/20">
                    <FileText size={22} className="text-accent-400" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-ink-500 dark:text-ink-400">Your cover letter will appear here</p>
                  <p className="mt-1 text-xs text-ink-400">Select a resume and fill in the form</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
