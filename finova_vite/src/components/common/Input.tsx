import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export function Input({ label, error, icon, className = "", ...props }: InputProps) {
  return (
    <label className="block">
      {label && <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>}
      <span className="relative block">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>}
        <input
          className={`h-11 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400/70 focus:ring-2 focus:ring-sky-400/20 ${icon ? "pl-10" : ""} ${className}`}
          {...props}
        />
      </span>
      {error && <span className="mt-1 block text-xs text-red-300">{error}</span>}
    </label>
  );
}
