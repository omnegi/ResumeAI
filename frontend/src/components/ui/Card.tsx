import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export default function Card({ children, className = "", glow = false }: CardProps) {
  return (
    <div
      className={`
        rounded-2xl transition-all duration-200
        bg-white dark:bg-navy-800
        border border-ink-200/60 dark:border-white/[0.07]
        shadow-card dark:shadow-cardDark
        ${glow ? "hover:glow-accent-sm hover:border-accent-500/30" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
