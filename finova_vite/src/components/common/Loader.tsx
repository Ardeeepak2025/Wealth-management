import { Loader2 } from "lucide-react";

export function Loader({ label = "Loading market data" }: { label?: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] text-slate-300">
      <Loader2 className="h-8 w-8 animate-spin text-sky-300" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
