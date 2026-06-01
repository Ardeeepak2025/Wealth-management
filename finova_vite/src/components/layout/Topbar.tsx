import { RefreshCw } from "lucide-react";
import { Button } from "@/components/common/Button";

export function Topbar({ title, description, onRefresh }: { title: string; description?: string; onRefresh?: () => void }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {description && <p className="mt-1 max-w-2xl text-sm text-slate-400">{description}</p>}
      </div>
      {onRefresh && (
        <Button variant="secondary" onClick={onRefresh} icon={<RefreshCw className="h-4 w-4" />}>
          Refresh
        </Button>
      )}
    </div>
  );
}
