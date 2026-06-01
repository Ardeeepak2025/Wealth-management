import { useEffect } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { Topbar } from "@/components/layout/Topbar";
import { FundHoldings as FundHoldingsTable } from "@/components/mutualfunds/FundHoldings";
import { useAuth } from "@/hooks/useAuth";
import { useMutualFunds } from "@/hooks/useMutualFunds";

export default function FundHoldings() {
  const { user } = useAuth();
  const { funds, holdings, loadFunds, loadFundDashboard } = useMutualFunds();

  useEffect(() => {
    loadFunds();
    if (user) loadFundDashboard(user.id);
  }, [loadFundDashboard, loadFunds, user]);

  return (
    <div>
      <Topbar title="Mutual Fund Holdings" description="All MF units and portfolio profit/loss from holdings API." />
      {holdings.length ? <FundHoldingsTable holdings={holdings} funds={funds} /> : <EmptyState title="No fund holdings" description="Buy a fund to see holdings here." />}
    </div>
  );
}
