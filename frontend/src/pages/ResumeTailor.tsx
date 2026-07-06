import { useState, useEffect, useRef } from "react";
import { 
  Send, Sparkles, Download, FileText, ArrowLeft, RefreshCw,
  Plus, Minus, Undo2, Redo2, Mail, Phone, MapPin, Linkedin, Github
} from "lucide-react";
import { Link } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { listResumes, fetchResumeText } from "@/api/resume";
import { tailorResume, resumeDownloadUrl } from "@/api/builder";
import type { Resume } from "@/types";

interface Message {
  sender: "user" | "agent";
  text: string;
  timestamp: Date;
}

const CUSTOM_PROMPTS = [
  {
    title: "How does my resume compare to top candidates with my job title? What am I missing and how can I improve?",
    subtitle: "Get a prioritized, actionable review"
  },
  {
    title: "Help me add a new experience to my resume",
    subtitle: "Add work experience, projects, or achievements"
  },
  {
    title: "Help me improve an existing experience in my resume",
    subtitle: "Enhance bullet points and descriptions"
  },
  {
    title: "Highlight the top keywords I'm missing for ATS",
    subtitle: "Boost ATS match by filling gaps"
  }
];

// Robust ATS dynamic document parser
function parseResumeToAts(text: string) {
  if (!text || text.includes("Loading resume content...")) return null;
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  const name = lines[0];
  let email = "";
  let phone = "";
  let location = "";
  let linkedin = "";
  let github = "";

  const sections: { [key: string]: string[] } = {};
  let currentSection = "SUMMARY";

  const sectionKeywords = [
    "EDUCATION", "TECHNICAL SKILLS", "SKILLS", "PROJECTS", 
    "EXPERIENCE", "WORK EXPERIENCE", "SUMMARY", "AWARDS", "LANGUAGES"
  ];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const upperLine = line.toUpperCase();
    
    // Parse contacts by regex/keywords
    if (line.includes("@") && !email) {
      email = line.replace(/^[-\|\s:]+/, "").trim();
      continue;
    }
    if (line.match(/[+0-9-]{10,}/) && !phone) {
      phone = line.replace(/^[-\|\s:]+/, "").trim();
      continue;
    }
    if ((line.includes("linkedin.com") || line.toLowerCase().includes("linkedin")) && !linkedin) {
      linkedin = line.replace(/^[-\|\s:]+/, "").trim();
      continue;
    }
    if ((line.includes("github.com") || line.toLowerCase().includes("github")) && !github) {
      github = line.replace(/^[-\|\s:]+/, "").trim();
      continue;
    }
    if ((line.includes("India") || line.includes("Delhi") || line.includes("USA") || line.includes("NY") || line.includes("London")) && !location) {
      location = line.replace(/^[-\|\s:]+/, "").trim();
      continue;
    }

    const matchedKeyword = sectionKeywords.find(k => upperLine === k || upperLine.startsWith(k + " ") || upperLine.startsWith(k + ":"));
    if (matchedKeyword) {
      currentSection = matchedKeyword;
      sections[currentSection] = [];
    } else {
      if (!sections[currentSection]) {
        sections[currentSection] = [];
      }
      sections[currentSection].push(line);
    }
  }

  return {
    name,
    email,
    phone,
    location,
    linkedin,
    github,
    sections
  };
}

export default function ResumeTailor() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | "">("");
  const [resumeContent, setResumeContent] = useState("");
  
  // Undo/Redo history states
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Zoom state (80% default matching mockup)
  const [zoom, setZoom] = useState(80);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "agent",
      text: "Hi there! I can help you improve your resume. Ask me for feedback, or improvements for specific sections I can directly edit your resume.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listResumes().then(setResumes);
  }, []);

  useEffect(() => {
    if (selectedResumeId) {
      setError("");
      setResumeContent("Loading resume content...");
      fetchResumeText(Number(selectedResumeId))
        .then((text) => {
          setResumeContent(text);
          setHistory([text]);
          setHistoryIndex(0);
        })
        .catch(() => setError("Failed to fetch resume content."));
    } else {
      setResumeContent("");
      setHistory([]);
      setHistoryIndex(-1);
    }
  }, [selectedResumeId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(customText?: string) {
    const textToSend = customText || input;
    if (!textToSend.trim()) return;
    if (!selectedResumeId) {
      setError("Please select a resume first.");
      return;
    }

    setError("");
    const userMsg: Message = { sender: "user", text: textToSend, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput("");

    const historyPayload = messages.map(m => ({ sender: m.sender, text: m.text }));

    setIsSubmitting(true);
    try {
      const response = await tailorResume({
        resume_id: Number(selectedResumeId),
        prompt: textToSend,
        current_content: resumeContent,
        history: historyPayload,
      });

      setResumeContent(response.modified_content);
      
      // Update history pointer for Undo/Redo
      const updatedHistory = history.slice(0, historyIndex + 1);
      setHistory([...updatedHistory, response.modified_content]);
      setHistoryIndex(updatedHistory.length);

      setMessages((prev) => [
        ...prev,
        { sender: "agent", text: response.message, timestamp: new Date() }
      ]);
    } catch (err: any) {
      setError("Failed to tailor resume. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleUndo() {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setResumeContent(history[prevIndex]);
      setMessages((prev) => [
        ...prev,
        { sender: "agent", text: "Undone last edit.", timestamp: new Date() }
      ]);
    }
  }

  function handleRedo() {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setResumeContent(history[nextIndex]);
      setMessages((prev) => [
        ...prev,
        { sender: "agent", text: "Redone edit.", timestamp: new Date() }
      ]);
    }
  }

  function handleClearChat() {
    setMessages([
      {
        sender: "agent",
        text: "Chat cleared. Ready for your next resume editing instruction!",
        timestamp: new Date()
      }
    ]);
  }

  const parsedResume = parseResumeToAts(resumeContent);

  return (
    <AppShell>
      <div className="animate-slide-up h-[85vh] flex flex-col">
        {/* Header */}
        <div className="mb-4 shrink-0 flex items-center justify-between">
          <div>
            <Link to="/dashboard" className="flex items-center gap-1 text-xs text-ink-400 hover:text-accent-400 transition-colors mb-1">
              <ArrowLeft size={12} /> Back to Dashboard
            </Link>
            <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-100 flex items-center gap-2">
              <Sparkles size={20} className="text-accent-400" /> Interactive Resume Tailor
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <select
              className="rounded-xl px-3 py-2 text-sm bg-white dark:bg-navy-800 border border-ink-200 dark:border-white/[0.08] text-ink-900 dark:text-ink-100 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value ? Number(e.target.value) : "")}
            >
              <option value="">Select a resume to edit...</option>
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.filename || `Resume #${r.id}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-3 rounded-lg bg-bad/10 border border-bad/20 px-3 py-2 text-xs text-bad shrink-0">
            {error}
          </div>
        )}

        {/* Workspace Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-0">
          {/* Chatbot left panel */}
          <div className="lg:col-span-2 flex flex-col min-h-0">
            <Card className="flex-1 flex flex-col p-4 min-h-0 overflow-hidden bg-white dark:bg-navy-800">
              {/* Left Panel Action Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-ink-100 dark:border-white/[0.05] shrink-0">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleClearChat}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-ink-200 dark:border-white/10 text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-navy-700 font-medium transition"
                  >
                    Clear
                  </button>
                  <button 
                    onClick={() => {
                      if (history.length > 0) {
                        setResumeContent(history[0]);
                        setHistoryIndex(0);
                        setMessages(prev => [...prev, { sender: "agent", text: "Reset resume to original upload state.", timestamp: new Date() }]);
                      }
                    }}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-ink-200 dark:border-white/10 text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-navy-700 font-medium transition"
                  >
                    Reset Resume
                  </button>
                </div>
                <Link to="/dashboard" className="text-xs text-bad font-medium hover:underline">
                  Close Chat
                </Link>
              </div>

              {/* Message history */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
                {messages.map((m, i) => (
                  <div key={i} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
                    <div className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm ${
                      m.sender === "user"
                        ? "bg-accent-500 text-white rounded-tr-none"
                        : "bg-ink-50 dark:bg-navy-700/40 text-ink-800 dark:text-ink-200 rounded-tl-none border border-ink-200/40 dark:border-white/[0.03]"
                    }`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                    </div>
                    <span className="text-[9px] text-ink-400 mt-1 px-1">
                      {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
                
                {/* Suggestions / Custom Mockup prompt cards */}
                {selectedResumeId && messages.length <= 2 && !isSubmitting && (
                  <div className="py-2 space-y-2.5 shrink-0">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-ink-400 mb-1">Quick Customizations:</p>
                    <div className="grid grid-cols-1 gap-2">
                      {CUSTOM_PROMPTS.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(p.title)}
                          className="flex flex-col text-left p-3 rounded-xl border border-dashed border-ink-300 dark:border-white/10 bg-ink-50/30 dark:bg-navy-700/10 hover:border-accent-500/50 hover:bg-accent-500/5 transition duration-150"
                        >
                          <span className="text-xs font-semibold text-ink-800 dark:text-ink-200 leading-tight">{p.title}</span>
                          <span className="text-[10px] text-ink-400 mt-1">{p.subtitle}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isSubmitting && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-tl-none bg-ink-50 dark:bg-navy-700/40 p-3.5 flex gap-1 border border-ink-200/40 dark:border-white/[0.03]">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Footer message indicator */}
              <div className="pb-2 text-center text-[10px] text-ink-400 border-t border-ink-100 dark:border-white/[0.05] pt-2 shrink-0">
                Messages are processed by AI. Verify important information. Chat tokens left: 25
              </div>

              {/* Input field */}
              <div className="pt-2 shrink-0 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask me for feedback, or improvements..."
                  className="flex-1 rounded-xl px-3.5 py-2.5 text-sm bg-ink-50 dark:bg-navy-700/50 border border-ink-200 dark:border-white/[0.08] text-ink-900 dark:text-ink-100 focus:outline-none focus:border-accent-500"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={!selectedResumeId || isSubmitting}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button
                  size="sm"
                  onClick={() => handleSend()}
                  disabled={!selectedResumeId || isSubmitting || !input.trim()}
                >
                  <Send size={14} />
                </Button>
              </div>
            </Card>
          </div>

          {/* Live workspace right panel (ATS Sheet Document Viewer) */}
          <div className="lg:col-span-3 flex flex-col min-h-0">
            <Card className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white dark:bg-navy-800">
              
              {/* ATS Document Editor Top Toolbar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-ink-100 dark:border-white/[0.05] shrink-0">
                {/* Zoom control pill */}
                <div className="flex items-center gap-1 bg-ink-50 dark:bg-navy-700/40 rounded-full px-2 py-1">
                  <button 
                    onClick={() => setZoom(prev => Math.max(prev - 10, 50))} 
                    className="p-1 rounded-full text-ink-500 hover:bg-ink-100 dark:hover:bg-navy-600 transition"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-xs font-mono px-2 text-ink-700 dark:text-ink-200">{zoom}%</span>
                  <button 
                    onClick={() => setZoom(prev => Math.min(prev + 10, 150))} 
                    className="p-1 rounded-full text-ink-500 hover:bg-ink-100 dark:hover:bg-navy-600 transition"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Undo / Redo controls */}
                <div className="flex items-center gap-1">
                  <button 
                    onClick={handleUndo} 
                    disabled={historyIndex <= 0}
                    className="p-2 rounded-full text-ink-500 hover:bg-ink-50 dark:hover:bg-navy-700 disabled:opacity-30 disabled:pointer-events-none transition"
                  >
                    <Undo2 size={14} />
                  </button>
                  <button 
                    onClick={handleRedo} 
                    disabled={historyIndex >= history.length - 1}
                    className="p-2 rounded-full text-ink-500 hover:bg-ink-50 dark:hover:bg-navy-700 disabled:opacity-30 disabled:pointer-events-none transition"
                  >
                    <Redo2 size={14} />
                  </button>
                </div>

                {/* Direct download */}
                {selectedResumeId && (
                  <a
                    href={resumeDownloadUrl(`/builder/download/${selectedResumeId}`)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="sm" variant="outline">
                      <Download size={13} /> Download PDF
                    </Button>
                  </a>
                )}
              </div>

              {/* ATS Structured Document Sheet Canvas */}
              <div className="flex-1 overflow-auto p-6 bg-ink-100/50 dark:bg-[#0b0f19]/30 flex justify-center items-start">
                {selectedResumeId ? (
                  parsedResume ? (
                    <div 
                      className="bg-white text-ink-900 border border-ink-200 shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-8 max-w-[800px] w-full min-h-[1050px] flex flex-col font-sans"
                      style={{ zoom: `${zoom}%` }}
                    >
                      {/* Name Header */}
                      <div className="border-b-2 border-ink-900 pb-4 mb-5 text-left">
                        <h2 className="text-3xl font-extrabold tracking-tight text-ink-900">{parsedResume.name}</h2>
                        
                        {/* Contacts line */}
                        <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-600">
                          {parsedResume.email && <span className="flex items-center gap-1"><Mail size={12} /> {parsedResume.email}</span>}
                          {parsedResume.phone && <span className="flex items-center gap-1"><Phone size={12} /> {parsedResume.phone}</span>}
                          {parsedResume.location && <span className="flex items-center gap-1"><MapPin size={12} /> {parsedResume.location}</span>}
                          {parsedResume.linkedin && <span className="flex items-center gap-1"><Linkedin size={12} /> LinkedIn</span>}
                          {parsedResume.github && <span className="flex items-center gap-1"><Github size={12} /> GitHub</span>}
                        </div>
                      </div>

                      {/* Two-Column Structured Grid */}
                      <div className="flex-1 grid grid-cols-5 gap-6 text-left">
                        {/* Left column (Narrow) */}
                        <div className="col-span-2 space-y-5 border-r border-ink-100 pr-5">
                          {/* Education section */}
                          {parsedResume.sections["EDUCATION"] && (
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-900 border-b border-ink-900 pb-1 mb-3">Education</h4>
                              <div className="space-y-3 text-xs leading-relaxed">
                                {parsedResume.sections["EDUCATION"].map((line, idx) => (
                                  <p key={idx} className={line.startsWith("-") ? "pl-2" : "font-semibold"}>
                                    {line.startsWith("-") ? line.substring(1).trim() : line}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Technical Skills section */}
                          {(parsedResume.sections["TECHNICAL SKILLS"] || parsedResume.sections["SKILLS"]) && (
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-900 border-b border-ink-900 pb-1 mb-3">Technical Skills</h4>
                              <div className="space-y-3 text-xs leading-relaxed">
                                {(parsedResume.sections["TECHNICAL SKILLS"] || parsedResume.sections["SKILLS"]).map((line, idx) => (
                                  <p key={idx} className={line.startsWith("-") ? "pl-2" : ""}>
                                    {line.startsWith("-") ? line.substring(1).trim() : line}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right column (Wide) */}
                        <div className="col-span-3 space-y-5 pl-1">
                          {/* Experience section */}
                          {(parsedResume.sections["EXPERIENCE"] || parsedResume.sections["WORK EXPERIENCE"]) && (
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-900 border-b border-ink-900 pb-1 mb-3">Experience</h4>
                              <div className="space-y-3 text-xs leading-relaxed">
                                {(parsedResume.sections["EXPERIENCE"] || parsedResume.sections["WORK EXPERIENCE"]).map((line, idx) => (
                                  <p key={idx} className={line.startsWith("-") ? "pl-3 -indent-3 text-ink-700" : "font-semibold text-ink-900 mt-2"}>
                                    {line}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Projects section */}
                          {parsedResume.sections["PROJECTS"] && (
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-900 border-b border-ink-900 pb-1 mb-3">Projects</h4>
                              <div className="space-y-3 text-xs leading-relaxed">
                                {parsedResume.sections["PROJECTS"].map((line, idx) => (
                                  <p key={idx} className={line.startsWith("-") ? "pl-3 -indent-3 text-ink-700" : "font-semibold text-ink-900 mt-2"}>
                                    {line}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="bg-white text-ink-900 border border-ink-200 shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-8 max-w-[800px] w-full min-h-[1050px] flex flex-col font-sans"
                      style={{ zoom: `${zoom}%` }}
                    >
                      {/* Simple formatted view if headers aren't parsed */}
                      <pre className="whitespace-pre-wrap font-sans text-xs text-left leading-relaxed text-ink-900">
                        {resumeContent}
                      </pre>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-500/10 border border-accent-500/20">
                      <RefreshCw size={22} className="text-accent-400" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-ink-500">Document preview workspace</p>
                    <p className="mt-1 text-xs text-ink-400">Select a resume to open it in the editor</p>
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
