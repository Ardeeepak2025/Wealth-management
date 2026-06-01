import { motion } from "framer-motion";
import { ShieldCheck, TrendingUp } from "lucide-react";
import type { MutualFund } from "@/types/mutualfund";
import { formatCurrency } from "@/utils/formatCurrency";

export function MutualFundCard({ fund, onClick }: { fund: MutualFund; onClick?: (fund: MutualFund) => void }) {
  return (
    <motion.button
      className="glass-card w-full rounded-2xl p-5 text-left transition hover:border-green-400/40"
      type="button"
      onClick={() => onClick?.(fund)}
      whileHover={{ y: -4 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-bold text-white">{fund.fund_name}</p>
          <p className="mt-1 text-sm text-slate-400">{fund.fund_type || "Uncategorized"}</p>
        </div>
        <span className="rounded-lg bg-green-400/15 p-2 text-green-300">
          <TrendingUp className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div>
          <p className="text-xs text-slate-500">NAV</p>
          <p className="font-semibold text-white">{formatCurrency(fund.nav || 0)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">High</p>
          <p className="font-semibold text-white">{formatCurrency(fund.highest_nav || 0)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Low</p>
          <p className="font-semibold text-white">{formatCurrency(fund.lowest_nav || 0)}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="h-4 w-4 text-sky-300" />
        Direct plan-ready data model
      </div>
    </motion.button>
  );
}
