import { useEffect } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { StockTable } from "@/components/stocks/StockTable";
import { useStocks } from "@/hooks/useStocks";

export default function Gainers() {
  const { topGainers, loadMarketMovers } = useStocks();

  useEffect(() => {
    loadMarketMovers();
  }, [loadMarketMovers]);

  return (
    <div>
      <Topbar title="Top Gainers" description="Best moving stocks from the stock server." />
      <StockTable stocks={topGainers} />
    </div>
  );
}
