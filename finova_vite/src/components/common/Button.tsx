import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  isLoading?: boolean;
  icon?: ReactNode;
}

const variants = {
  primary: "bg-sky-400 text-slate-950 hover:bg-sky-300 shadow-glow",
  secondary: "bg-white/10 text-slate-100 hover:bg-white/15 border border-white/10",
  ghost: "bg-transparent text-slate-300 hover:bg-white/10",
  danger: "bg-red-500/90 text-white hover:bg-red-400",
};

export function Button({ children, className = "", variant = "primary", isLoading, icon, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}
