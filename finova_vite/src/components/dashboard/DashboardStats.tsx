import { BriefcaseBusiness, Landmark, TrendingUp, Wallet } from "lucide-react";
import { PortfolioCard } from "./PortfolioCard";
import type { DashboardSummary } from "@/types/stock";

export function DashboardStats({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <PortfolioCard label="Net Worth" value={summary.netWorth} helper="Wallet + current stock value" icon={Landmark} />
      <PortfolioCard label="Wallet Balance" value={summary.walletBalance} helper="Available for new orders" icon={Wallet} tone="green" />
      <PortfolioCard label="Invested Capital" value={summary.totalInvestment} helper={`${summary.totalHoldings} active holdings`} icon={BriefcaseBusiness} tone="amber" />
      <PortfolioCard label="Total P/L" value={summary.totalProfitLoss} helper="Real-time mark to market" icon={TrendingUp} tone={summary.totalProfitLoss >= 0 ? "green" : "red"} />
    </div>
  );
}
