import { BarChart3 } from "lucide-react";
import type { Stock } from "@/types/stock";
import { formatCurrency, formatPercent } from "@/utils/formatCurrency";

export function MarketOverview({ best, worst }: { best?: Stock; worst?: Stock }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-sky-400/15 p-3 text-sky-300">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Market Overview</h3>
          <p className="text-sm text-slate-400">Best and weakest priced assets</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[best, worst].map((stock, index) => (
          <div key={index} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">{index === 0 ? "Best Stock" : "Worst Stock"}</p>
            <p className="mt-2 font-semibold text-white">{stock?.symbol || "N/A"}</p>
            <p className="text-sm text-slate-400">{stock?.company_name || "Awaiting data"}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-semibold text-white">{formatCurrency(stock?.current_price || 0)}</span>
              <span className={(stock?.day_change_percent || 0) >= 0 ? "text-green-300" : "text-red-300"}>{formatPercent(stock?.day_change_percent || 0)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
