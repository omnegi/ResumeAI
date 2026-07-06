import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, UploadCloud, FileText, Sparkles,
  LogOut, Sun, Moon, ChevronRight, BrainCircuit, MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const navItems = [
  { to: "/dashboard",    label: "Dashboard",        icon: LayoutDashboard },
  { to: "/upload",       label: "AI Resume Analyzer", icon: BrainCircuit },
  { to: "/builder",      label: "Resume Builder",    icon: FileText },
  { to: "/tailor",       label: "Resume Tailor (Chat)", icon: MessageSquare },
  { to: "/cover-letter", label: "CV Generator",      icon: Sparkles },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const initials = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  const pageTitle = navItems.find((n) => location.pathname.startsWith(n.to))?.label ?? "Dashboard";

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 ${collapsed ? "justify-center" : ""}`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 shadow-pop">
          <BrainCircuit size={18} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-display text-base font-bold text-ink-900 dark:text-ink-100">
            ResumeAI
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="mt-2 flex-1 space-y-1 px-3">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? label : undefined}
              className={`nav-item ${active ? "nav-item-active" : "nav-item-inactive"} ${collapsed ? "justify-center" : ""}`}
            >
              <Icon size={18} className={active ? "text-accent-400 dark:text-accent-300" : ""} />
              {!collapsed && <span>{label}</span>}
              {!collapsed && active && <ChevronRight size={14} className="ml-auto text-accent-400/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom glow blob */}
      <div className="sidebar-blob pointer-events-none absolute bottom-0 left-0 h-64 w-full" />

      {/* Footer */}
      <div className={`relative space-y-1 border-t border-subtle p-3`}>
        {/* Theme toggle */}
        <button
          onClick={toggle}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className={`nav-item nav-item-inactive w-full ${collapsed ? "justify-center" : ""}`}
        >
          {theme === "dark"
            ? <Sun size={18} className="text-warn" />
            : <Moon size={18} className="text-accent-400" />
          }
          {!collapsed && (
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          )}
        </button>

        {/* User + logout */}
        {!collapsed ? (
          <div className="flex items-center gap-2 rounded-xl px-3 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-accent-700 text-xs font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-ink-900 dark:text-ink-100">{user?.full_name}</p>
              <p className="truncate text-[10px] text-ink-500 dark:text-ink-400">{user?.email}</p>
            </div>
            <button onClick={handleLogout} title="Logout" className="rounded-lg p-1.5 text-ink-400 hover:bg-bad/10 hover:text-bad transition-colors">
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            title="Logout"
            className="nav-item nav-item-inactive w-full justify-center"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen page-bg font-body">
      {/* Desktop sidebar */}
      <aside
        className={`
          relative hidden lg:flex flex-col flex-shrink-0
          border-r border-subtle
          bg-white dark:bg-navy-800
          transition-all duration-300 overflow-hidden
          ${collapsed ? "w-16" : "w-60"}
        `}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-subtle bg-white dark:bg-navy-700 text-ink-500 shadow-card hover:border-accent-500 hover:text-accent-400 transition-all"
        >
          <ChevronRight size={12} className={`transition-transform ${collapsed ? "" : "rotate-180"}`} />
        </button>
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-60 bg-white dark:bg-navy-800 border-r border-subtle shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-subtle bg-white/90 dark:bg-navy-800/90 backdrop-blur px-6 py-3">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <span className="h-0.5 w-5 bg-ink-500 dark:bg-ink-400 rounded" />
            <span className="h-0.5 w-5 bg-ink-500 dark:bg-ink-400 rounded" />
            <span className="h-0.5 w-3 bg-ink-500 dark:bg-ink-400 rounded" />
          </button>

          <div className="lg:hidden flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent-500 to-accent-700">
              <BrainCircuit size={14} className="text-white" />
            </div>
            <span className="font-display text-sm font-bold text-ink-900 dark:text-ink-100">ResumeAI</span>
          </div>

          <h1 className="hidden lg:block font-display text-base font-bold text-ink-900 dark:text-ink-100">
            {pageTitle}
          </h1>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-accent-700 text-xs font-bold text-white">
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
