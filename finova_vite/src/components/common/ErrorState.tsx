import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-red-500/15 p-3 text-red-300">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-semibold text-white">Unable to load data</h3>
            <p className="text-sm text-slate-400">{message}</p>
          </div>
        </div>
        {onRetry && <Button onClick={onRetry}>Retry</Button>}
      </div>
    </div>
  );
}
