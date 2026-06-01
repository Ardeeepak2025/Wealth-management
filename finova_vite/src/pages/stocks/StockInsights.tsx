import { useEffect } from "react";
import { GainersWidget } from "@/components/dashboard/GainersWidget";
import { LosersWidget } from "@/components/dashboard/LosersWidget";
import { Topbar } from "@/components/layout/Topbar";
import { StockInsights as StockInsightsPanel } from "@/components/stocks/StockInsights";
import { useStocks } from "@/hooks/useStocks";

export default function StockInsights() {
  const { stocks, topGainers, topLosers, loadStocks, loadMarketMovers } = useStocks();

  useEffect(() => {
    loadStocks();
    loadMarketMovers();
  }, [loadMarketMovers, loadStocks]);

  return (
    <div>
      <Topbar title="Stock Insights" description="Sector maps, top gainers, and top losers from stock analytics endpoints." />
      <StockInsightsPanel stocks={stocks} />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <GainersWidget stocks={topGainers} />
        <LosersWidget stocks={topLosers} />
      </div>
    </div>
  );
}
