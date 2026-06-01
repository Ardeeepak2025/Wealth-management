import { useEffect } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { Topbar } from "@/components/layout/Topbar";
import { HoldingsTable } from "@/components/stocks/HoldingsTable";
import { useAuth } from "@/hooks/useAuth";
import { useStocks } from "@/hooks/useStocks";

export default function StockHoldings() {
  const { user } = useAuth();
  const { holdings, loadDashboardData } = useStocks();

  useEffect(() => {
    if (user) loadDashboardData(user.id);
  }, [loadDashboardData, user]);

  return (
    <div>
      <Topbar title="Stock Holdings" description="Your live stock positions, cost basis, current value, and mark-to-market profit/loss." />
      {holdings.length ? <HoldingsTable holdings={holdings} /> : <EmptyState title="No stock holdings" description="Buy stocks to start building your equity portfolio." />}
    </div>
  );
}
