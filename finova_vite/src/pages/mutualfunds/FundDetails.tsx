import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "@/components/common/Loader";
import { Topbar } from "@/components/layout/Topbar";
import { NAVChart } from "@/components/mutualfunds/NAVChart";
import { mutualFundService } from "@/services/mutualFundService";
import type { MutualFund } from "@/types/mutualfund";
import { fallbackFunds } from "@/utils/constants";
import { formatCurrency } from "@/utils/formatCurrency";

export default function FundDetails() {
  const { id } = useParams();
  const [fund, setFund] = useState<MutualFund | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fundId = Number(id);
    if (!fundId) return;
    setLoading(true);
    mutualFundService
      .getFund(fundId)
      .then(setFund)
      .catch(() => setFund(fallbackFunds.find((item) => item.id === fundId) || fallbackFunds[0]))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !fund) return <Loader label="Loading fund details" />;

  return (
    <div>
      <Topbar title={fund.fund_name} description={fund.fund_type || "Mutual fund details"} />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <NAVChart fund={fund} />
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-xl font-bold text-white">Fund Snapshot</h3>
          <div className="mt-5 space-y-3">
            <Detail label="NAV" value={formatCurrency(fund.nav || 0)} />
            <Detail label="Highest NAV" value={formatCurrency(fund.highest_nav || 0)} />
            <Detail label="Lowest NAV" value={formatCurrency(fund.lowest_nav || 0)} />
            <Detail label="Category" value={fund.fund_type || "Uncategorized"} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
