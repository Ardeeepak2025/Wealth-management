import { useEffect } from "react";
import { SellStockForm } from "@/components/stocks/SellStockForm";
import { Topbar } from "@/components/layout/Topbar";
import { useAuth } from "@/hooks/useAuth";
import { useStocks } from "@/hooks/useStocks";

export default function SellStocks() {
  const { user } = useAuth();
  const { loadDashboardData } = useStocks();

  useEffect(() => {
    if (user) loadDashboardData(user.id);
  }, [loadDashboardData, user]);

  return (
    <div>
      <Topbar title="Sell Stocks" description="Sell from your verified holdings and update portfolio summary." />
      <SellStockForm />
    </div>
  );
}
