import { Link } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { StockChart } from "./StockChart";
import type { Stock } from "@/types/stock";
import { makeTrend } from "@/utils/chartUtils";
import { formatCurrency, formatNumber, formatPercent } from "@/utils/formatCurrency";

export function StockModal({ stock, isOpen, onClose }: { stock: Stock | null; isOpen: boolean; onClose: () => void }) {
  if (!stock) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${stock.symbol} Details`} size="lg">
      <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <section>
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-white">{stock.company_name}</h3>
            <p className="text-sm text-slate-400">{stock.sector}</p>
          </div>
          <StockChart data={makeTrend(stock.current_price)} height={280} />
        </section>
        <section className="space-y-3">
          {[
            ["Current Price", formatCurrency(stock.current_price)],
            ["Market Cap", formatCurrency(stock.market_cap || 0)],
            ["Available Quantity", formatNumber(stock.available_quantity)],
            ["Day Change", formatPercent(stock.day_change_percent || 0)],
            ["High", formatCurrency(stock.highest_price)],
            ["Low", formatCurrency(stock.lowest_price)],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3">
              <span className="text-sm text-slate-400">{label}</span>
              <span className="font-semibold text-white">{value}</span>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link to="/stocks/buy" onClick={onClose}>
              <Button className="w-full">Buy</Button>
            </Link>
            <Link to="/stocks/sell" onClick={onClose}>
              <Button className="w-full" variant="secondary">
                Sell
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </Modal>
  );
}
