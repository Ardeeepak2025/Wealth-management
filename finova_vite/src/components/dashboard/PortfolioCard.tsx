import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";

interface PortfolioCardProps {
  label: string;
  value: number;
  helper?: string;
  icon: LucideIcon;
  tone?: "blue" | "green" | "red" | "amber";
}

const toneMap = {
  blue: "text-sky-300 bg-sky-400/15 ring-sky-400/25",
  green: "text-green-300 bg-green-400/15 ring-green-400/25",
  red: "text-red-300 bg-red-400/15 ring-red-400/25",
  amber: "text-amber-300 bg-amber-400/15 ring-amber-400/25",
};

export function PortfolioCard({ label, value, helper, icon: Icon, tone = "blue" }: PortfolioCardProps) {
  return (
    <motion.div className="glass-card rounded-2xl p-5" whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 280, damping: 22 }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-3 text-2xl font-bold text-white">{formatCurrency(value)}</p>
          {helper && <p className="mt-2 text-xs text-slate-500">{helper}</p>}
        </div>
        <div className={`rounded-xl p-3 ring-1 ${toneMap[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
