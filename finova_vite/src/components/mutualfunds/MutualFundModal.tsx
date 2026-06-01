import { Link } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import type { MutualFund } from "@/types/mutualfund";
import { formatCurrency } from "@/utils/formatCurrency";
import { MutualFundChart } from "./MutualFundChart";

export function MutualFundModal({ fund, isOpen, onClose }: { fund: MutualFund | null; isOpen: boolean; onClose: () => void }) {
  if (!fund) return null;
  return (
    <Modal title={fund.fund_name} isOpen={isOpen} onClose={onClose} size="lg">
      <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <MutualFundChart nav={fund.nav || 100} height={280} />
        <div className="space-y-3">
          {[
            ["Category", fund.fund_type || "Uncategorized"],
            ["NAV", formatCurrency(fund.nav || 0)],
            ["Highest NAV", formatCurrency(fund.highest_nav || 0)],
            ["Lowest NAV", formatCurrency(fund.lowest_nav || 0)],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3">
              <span className="text-sm text-slate-400">{label}</span>
              <span className="font-semibold text-white">{value}</span>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link to="/mutualfunds/buy" onClick={onClose}>
              <Button className="w-full">Buy</Button>
            </Link>
            <Link to="/mutualfunds/sell" onClick={onClose}>
              <Button className="w-full" variant="secondary">
                Redeem
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
