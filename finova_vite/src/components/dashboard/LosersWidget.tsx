import type { Stock } from "@/types/stock";
import { formatCurrency, formatPercent } from "@/utils/formatCurrency";

export function LosersWidget({ stocks }: { stocks: Stock[] }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="font-semibold text-white">Top Losers</h3>
      <div className="mt-4 space-y-3">
        {stocks.slice(0, 5).map((stock) => (
          <div key={stock.id} className="flex items-center justify-between rounded-xl bg-white/[0.04] p-3">
            <div>
              <p className="font-semibold text-white">{stock.symbol}</p>
              <p className="text-xs text-slate-500">{stock.sector}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white">{formatCurrency(stock.current_price)}</p>
              <p className="text-xs text-red-300">{formatPercent(stock.day_change_percent || 0)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
