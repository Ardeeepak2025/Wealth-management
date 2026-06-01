import { useEffect } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { SellFundForm } from "@/components/mutualfunds/SellFundForm";
import { useAuth } from "@/hooks/useAuth";
import { useMutualFunds } from "@/hooks/useMutualFunds";

export default function SellFunds() {
  const { user } = useAuth();
  const { loadFunds, loadFundDashboard } = useMutualFunds();

  useEffect(() => {
    loadFunds();
    if (user) loadFundDashboard(user.id);
  }, [loadFundDashboard, loadFunds, user]);

  return (
    <div>
      <Topbar title="Redeem Mutual Funds" description="Create a SELL transaction for existing mutual fund units." />
      <SellFundForm />
    </div>
  );
}
