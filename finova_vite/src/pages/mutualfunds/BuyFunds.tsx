import { useEffect } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { BuyFundForm } from "@/components/mutualfunds/BuyFundForm";
import { useMutualFunds } from "@/hooks/useMutualFunds";

export default function BuyFunds() {
  const { loadFunds } = useMutualFunds();

  useEffect(() => {
    loadFunds();
  }, [loadFunds]);

  return (
    <div>
      <Topbar title="Buy Mutual Funds" description="Invest into a fund using the mutual fund transactions API." />
      <BuyFundForm />
    </div>
  );
}
