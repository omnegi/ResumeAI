import { useState } from "react";
import { Plus, Trash2, Wand2, Download } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { generateResume, resumeDownloadUrl } from "@/api/builder";
import type { BuildResumeRequest, BuiltResumeOut, Education, Experience } from "@/types";

const emptyEducation: Education = { degree: "", institution: "", start_year: "", end_year: "" };
const emptyExperience: Experience = { role: "", company: "", start_date: "", end_date: "", description: "" };

export default function ResumeBuilder() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");
  const [projects, setProjects] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [education, setEducation] = useState<Education[]>([{ ...emptyEducation }]);
  const [experience, setExperience] = useState<Experience[]>([{ ...emptyExperience }]);
  const [result, setResult] = useState<BuiltResumeOut | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateEducation(index: number, field: keyof Education, value: string) {
    setEducation((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)));
  }
  function updateExperience(index: number, field: keyof Experience, value: string) {
    setExperience((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)));
  }

  async function handleSubmit() {
    setError("");
    if (!fullName || !email) { setError("Full name and email are required."); return; }
    const payload: BuildResumeRequest = {
      full_name: fullName, email,
      phone: phone || undefined, location: location || undefined,
      target_role: targetRole || undefined, summary: summary || undefined,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      education: education.filter((e) => e.degree && e.institution),
      experience: experience.filter((e) => e.role && e.company),
      projects: projects || undefined, job_description: jobDescription || undefined,
    };
    setIsSubmitting(true);
    try {
      setResult(await generateResume(payload));
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Could not generate resume. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const sectionHeader = (title: string, onAdd: () => void) => (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-display font-bold text-ink-900 dark:text-ink-100">{title}</h3>
      <Button size="sm" variant="ghost" onClick={onAdd}>
        <Plus size={13} /> Add
      </Button>
    </div>
  );

  return (
    <AppShell>
      <div className="animate-slide-up">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent-400">AI Resume Builder</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-ink-900 dark:text-ink-100">Resume Builder</h1>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Fill in your details and let AI write a polished resume.</p>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Form column */}
          <div className="space-y-5">
            {/* Basic info */}
            <Card className="p-5">
              <h3 className="mb-4 font-display font-bold text-ink-900 dark:text-ink-100">Basic Info</h3>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div className="mt-3 space-y-3">
                <Input label="Target Role" placeholder="e.g. Senior Product Manager" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
                <Textarea label="Professional Summary (optional)" rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} />
                <Input label="Skills (comma-separated)" placeholder="React, TypeScript, Leadership" value={skills} onChange={(e) => setSkills(e.target.value)} />
              </div>
            </Card>

            {/* Education */}
            <Card className="p-5">
              {sectionHeader("Education", () => setEducation((p) => [...p, { ...emptyEducation }]))}
              {education.map((edu, i) => (
                <div key={i} className="mb-3 rounded-xl border border-ink-100 dark:border-white/[0.06] p-3 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Degree" value={edu.degree} onChange={(e) => updateEducation(i, "degree", e.target.value)} />
                    <Input label="Institution" value={edu.institution} onChange={(e) => updateEducation(i, "institution", e.target.value)} />
                    <Input label="Start Year" value={edu.start_year} onChange={(e) => updateEducation(i, "start_year", e.target.value)} />
                    <Input label="End Year" value={edu.end_year} onChange={(e) => updateEducation(i, "end_year", e.target.value)} />
                  </div>
                  {education.length > 1 && (
                    <button onClick={() => setEducation((p) => p.filter((_, idx) => idx !== i))}
                      className="flex items-center gap-1 text-xs text-bad hover:opacity-80 transition-opacity">
                      <Trash2 size={11} /> Remove
                    </button>
                  )}
                </div>
              ))}
            </Card>

            {/* Experience */}
            <Card className="p-5">
              {sectionHeader("Experience", () => setExperience((p) => [...p, { ...emptyExperience }]))}
              {experience.map((exp, i) => (
                <div key={i} className="mb-3 rounded-xl border border-ink-100 dark:border-white/[0.06] p-3 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Role" value={exp.role} onChange={(e) => updateExperience(i, "role", e.target.value)} />
                    <Input label="Company" value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} />
                    <Input label="Start Date" value={exp.start_date} onChange={(e) => updateExperience(i, "start_date", e.target.value)} />
                    <Input label="End Date" value={exp.end_date} onChange={(e) => updateExperience(i, "end_date", e.target.value)} />
                  </div>
                  <Textarea label="Description" rows={2} value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} />
                  {experience.length > 1 && (
                    <button onClick={() => setExperience((p) => p.filter((_, idx) => idx !== i))}
                      className="flex items-center gap-1 text-xs text-bad hover:opacity-80 transition-opacity">
                      <Trash2 size={11} /> Remove
                    </button>
                  )}
                </div>
              ))}
            </Card>

            {/* Projects & targeting */}
            <Card className="p-5 space-y-3">
              <h3 className="font-display font-bold text-ink-900 dark:text-ink-100">Projects & Targeting</h3>
              <Textarea label="Projects (optional)" rows={3} value={projects} onChange={(e) => setProjects(e.target.value)} />
              <Textarea label="Job Description (tailors keywords)" rows={3} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
            </Card>

            {error && (
              <div className="rounded-xl bg-bad/10 border border-bad/20 px-4 py-3 text-sm text-bad">{error}</div>
            )}

            <Button size="lg" className="w-full" isLoading={isSubmitting} onClick={handleSubmit}>
              <Wand2 size={16} /> Generate Resume
            </Button>
          </div>

          {/* Preview column */}
          <div>
            <Card className="sticky top-20 overflow-hidden">
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
                  <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-ink-700 dark:text-ink-300">
                    {result.content}
                  </pre>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-500/10 border border-accent-500/20">
                      <Wand2 size={22} className="text-accent-400" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-ink-500 dark:text-ink-400">Your generated resume will appear here</p>
                    <p className="mt-1 text-xs text-ink-400">Fill in the form and click Generate</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
