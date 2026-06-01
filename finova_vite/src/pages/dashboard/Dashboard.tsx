import { useEffect } from "react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { GainersWidget } from "@/components/dashboard/GainersWidget";
import { HoldingsWidget } from "@/components/dashboard/HoldingsWidget";
import { LosersWidget } from "@/components/dashboard/LosersWidget";
import { MarketOverview } from "@/components/dashboard/MarketOverview";
import { ProfitLossChart } from "@/components/dashboard/ProfitLossChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { Topbar } from "@/components/layout/Topbar";
import { CardSkeleton } from "@/components/common/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useStocks } from "@/hooks/useStocks";

export default function Dashboard() {
  const { user } = useAuth();
  const { summary, holdings, transactions, topGainers, topLosers, loading, loadDashboardData, loadMarketMovers, loadStocks } = useStocks();

  useEffect(() => {
    if (!user) return;
    loadDashboardData(user.id);
    loadMarketMovers();
    loadStocks();
  }, [loadDashboardData, loadMarketMovers, loadStocks, user]);

  return (
    <div>
      <Topbar title="Dashboard" description="A consolidated view of your market exposure, cash, transactions, and performance." onRefresh={() => user && loadDashboardData(user.id)} />
      {loading && holdings.length === 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <DashboardStats summary={summary} />
      )}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_.9fr]">
        <ProfitLossChart />
        <MarketOverview best={topGainers[0]} worst={topLosers[0]} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <HoldingsWidget holdings={holdings} />
        <RecentTransactions transactions={transactions} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <GainersWidget stocks={topGainers} />
        <LosersWidget stocks={topLosers} />
      </div>
    </div>
  );
}
