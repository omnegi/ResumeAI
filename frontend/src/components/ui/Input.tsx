import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const baseInput = `
  w-full rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200
  bg-ink-50 dark:bg-navy-700/50
  border border-ink-200 dark:border-white/[0.08]
  text-ink-900 dark:text-ink-100
  placeholder:text-ink-400 dark:placeholder:text-navy-500
  focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20
  dark:focus:border-accent-400 dark:focus:ring-accent-400/20
`;

export function Input({ label, error, className = "", id, ...rest }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
          {label}
        </label>
      )}
      <input id={id} className={`${baseInput} ${error ? "border-bad focus:border-bad focus:ring-bad/20" : ""} ${className}`} {...rest} />
      {error && <p className="mt-1 text-xs text-bad">{error}</p>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = "", id, ...rest }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`${baseInput} resize-none leading-relaxed ${error ? "border-bad focus:border-bad focus:ring-bad/20" : ""} ${className}`}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-bad">{error}</p>}
    </div>
  );
}
