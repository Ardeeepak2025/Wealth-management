import { Inbox } from "lucide-react";

export function EmptyState({ title = "Nothing here yet", description = "Data will appear here once available." }: { title?: string; description?: string }) {
  return (
    <div className="glass-card flex min-h-52 flex-col items-center justify-center rounded-2xl p-8 text-center">
      <div className="mb-4 rounded-2xl bg-white/10 p-4 text-sky-300">
        <Inbox className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-400">{description}</p>
    </div>
  );
}
