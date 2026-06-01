import { useEffect } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { StockTable } from "@/components/stocks/StockTable";
import { useStocks } from "@/hooks/useStocks";

export default function Losers() {
  const { topLosers, loadMarketMovers } = useStocks();

  useEffect(() => {
    loadMarketMovers();
  }, [loadMarketMovers]);

  return (
    <div>
      <Topbar title="Top Losers" description="Weakest moving stocks from the stock server." />
      <StockTable stocks={topLosers} />
    </div>
  );
}
