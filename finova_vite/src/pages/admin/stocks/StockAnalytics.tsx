import { useEffect } from "react";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { Topbar } from "@/components/layout/Topbar";
import { useStocks } from "@/hooks/useStocks";

export default function StockAnalytics() {
  const { stocks, loadStocks } = useStocks();

  useEffect(() => {
    loadStocks();
  }, [loadStocks]);

  const data = stocks.map((stock) => ({ label: stock.symbol, value: stock.current_price }));

  return (
    <div>
      <Topbar title="Stock Analytics" description="Administrative price chart for current stock catalog." />
      <AdminAnalytics title="Current Stock Prices" data={data} />
    </div>
  );
}
