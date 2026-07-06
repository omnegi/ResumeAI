import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: ReactNode;
}

const variants = {
  primary:
    "bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-500 hover:to-accent-400 text-white shadow-pop hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:translate-y-0",
  outline:
    "border border-accent-500/50 text-accent-400 dark:text-accent-300 hover:bg-accent-500/10 hover:border-accent-400 bg-transparent",
  ghost:
    "text-ink-500 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-navy-700/60 bg-transparent",
  danger:
    "bg-bad/10 text-bad hover:bg-bad/20 border border-bad/20 bg-transparent",
};

const sizes = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-sm gap-2 rounded-xl font-semibold",
};

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-200 focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-accent-500/50
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...rest}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Processing…
        </span>
      ) : (
        children
      )}
    </button>
  );
}
