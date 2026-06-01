import { useEffect } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { PortfolioAnalytics } from "@/components/realestate/PortfolioAnalytics";
import { ValuationChart } from "@/components/realestate/ValuationChart";
import { useAuth } from "@/hooks/useAuth";
import { useRealEstate } from "@/hooks/useRealEstate";

export default function Portfolio() {
  const { user } = useAuth();
  const { portfolio, loadPortfolio } = useRealEstate();

  useEffect(() => {
    loadPortfolio(user?.id || 1);
  }, [loadPortfolio, user]);

  return (
    <div>
      <Topbar title="Real Estate Portfolio" description="Investor-level property value and rent analytics." />
      <PortfolioAnalytics portfolio={portfolio} />
      {portfolio && (
        <div className="mt-6">
          <ValuationChart data={portfolio.valuationTrend} />
        </div>
      )}
    </div>
  );
}
