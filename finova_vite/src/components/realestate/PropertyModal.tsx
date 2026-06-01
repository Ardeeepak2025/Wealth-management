import { Modal } from "@/components/common/Modal";
import type { Property } from "@/types/realestate";
import { formatCurrency } from "@/utils/formatCurrency";

export function PropertyModal({ property, open, onClose }: { property: Property | null; open: boolean; onClose: () => void }) {
  if (!property) return null;
  return (
    <Modal isOpen={open} onClose={onClose} title={property.title}>
      <div className="grid gap-3">
        {[
          ["Location", property.location],
          ["Type", property.propertyType],
          ["Purchase Price", formatCurrency(property.purchasePrice)],
          ["Current Value", formatCurrency(property.currentValue)],
          ["Monthly Rent Estimate", formatCurrency(property.rentEstimate)],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <span className="text-sm text-slate-400">{label}</span>
            <span className="font-semibold text-white">{value}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}
