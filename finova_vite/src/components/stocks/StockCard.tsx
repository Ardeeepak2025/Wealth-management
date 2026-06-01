import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { Stock } from "@/types/stock";
import { formatCompactCurrency, formatCurrency, formatNumber, formatPercent } from "@/utils/formatCurrency";

interface StockCardProps {
  stock: Stock;
  onClick?: (stock: Stock) => void;
}

export function StockCard({ stock, onClick }: StockCardProps) {
  const positive = Number(stock.day_change_percent || 0) >= 0;
  const TrendIcon = positive ? ArrowUpRight : ArrowDownRight;

  return (
    <motion.button
      type="button"
      className="glass-card w-full rounded-2xl p-5 text-left transition hover:border-sky-400/40"
      whileHover={{ y: -4 }}
      onClick={() => onClick?.(stock)}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xl font-bold text-white">{stock.symbol}</p>
          <p className="mt-1 line-clamp-1 text-sm text-slate-400">{stock.company_name}</p>
        </div>
        <span className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold ${positive ? "bg-green-400/15 text-green-300" : "bg-red-400/15 text-red-300"}`}>
          <TrendIcon className="h-3.5 w-3.5" />
          {formatPercent(stock.day_change_percent || 0)}
        </span>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-slate-500">Price</p>
          <p className="font-semibold text-white">{formatCurrency(stock.current_price)}</p>
        </div>
        <div>
          <p className="text-slate-500">Market Cap</p>
          <p className="font-semibold text-white">{formatCompactCurrency(stock.market_cap || 0)}</p>
        </div>
        <div>
          <p className="text-slate-500">Available</p>
          <p className="font-semibold text-white">{formatNumber(stock.available_quantity)}</p>
        </div>
        <div>
          <p className="text-slate-500">Sector</p>
          <p className="font-semibold text-white">{stock.sector}</p>
        </div>
      </div>
    </motion.button>
  );
}
