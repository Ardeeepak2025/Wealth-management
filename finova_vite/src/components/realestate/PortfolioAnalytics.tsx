import type { RealEstatePortfolio } from "@/types/realestate";
import { formatCurrency } from "@/utils/formatCurrency";

export function PortfolioAnalytics({ portfolio }: { portfolio: RealEstatePortfolio | null }) {
  const cards = [
    { label: "Total Property Value", value: portfolio?.totalValue || 0 },
    { label: "Monthly Rent", value: portfolio?.totalRent || 0 },
    { label: "Properties", value: portfolio?.properties.length || 0, raw: true },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="glass-card rounded-2xl p-5">
          <p className="text-sm text-slate-400">{card.label}</p>
          <p className="mt-3 text-2xl font-bold text-white">{card.raw ? card.value : formatCurrency(card.value)}</p>
        </div>
      ))}
    </div>
  );
}
