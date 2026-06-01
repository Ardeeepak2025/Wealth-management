import { useEffect } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { Topbar } from "@/components/layout/Topbar";
import { ValuationChart } from "@/components/realestate/ValuationChart";
import { useAuth } from "@/hooks/useAuth";
import { useRealEstate } from "@/hooks/useRealEstate";

export default function Valuations() {
  const { user } = useAuth();
  const { portfolio, loadPortfolio } = useRealEstate();

  useEffect(() => {
    loadPortfolio(user?.id || 1);
  }, [loadPortfolio, user]);

  return (
    <div>
      <Topbar title="Valuations" description="Trend chart for real estate portfolio valuations." />
      {portfolio ? <ValuationChart data={portfolio.valuationTrend} /> : <EmptyState title="No valuations" description="Valuation data is unavailable for this portfolio." />}
    </div>
  );
}
