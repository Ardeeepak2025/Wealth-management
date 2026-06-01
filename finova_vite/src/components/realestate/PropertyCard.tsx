import { Building2 } from "lucide-react";
import type { Property } from "@/types/realestate";
import { formatCurrency } from "@/utils/formatCurrency";

export function PropertyCard({ property, onClick }: { property: Property; onClick?: (property: Property) => void }) {
  return (
    <button className="glass-card w-full rounded-2xl p-5 text-left transition hover:border-sky-400/40" onClick={() => onClick?.(property)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-lg font-bold text-white">{property.title}</p>
          <p className="mt-1 text-sm text-slate-400">{property.location}</p>
        </div>
        <span className="rounded-xl bg-sky-400/15 p-3 text-sky-300">
          <Building2 className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Metric label="Value" value={property.currentValue} />
        <Metric label="Rent" value={property.rentEstimate} />
      </div>
    </button>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-semibold text-white">{formatCurrency(value)}</p>
    </div>
  );
}
