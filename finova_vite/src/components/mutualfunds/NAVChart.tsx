import type { MutualFund } from "@/types/mutualfund";
import { MutualFundChart } from "./MutualFundChart";

export function NAVChart({ fund }: { fund: MutualFund }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-5">
        <h3 className="font-semibold text-white">{fund.fund_name} NAV</h3>
        <p className="text-sm text-slate-400">Generated trend from current NAV until historical API is expanded</p>
      </div>
      <MutualFundChart nav={fund.nav || 100} height={300} />
    </div>
  );
}
