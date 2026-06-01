import { useEffect } from "react";
import { ManageFundsTable } from "@/components/admin/ManageFundsTable";
import { Topbar } from "@/components/layout/Topbar";
import { useMutualFunds } from "@/hooks/useMutualFunds";

export default function DeleteFund() {
  const { funds, loadFunds } = useMutualFunds();

  useEffect(() => {
    loadFunds();
  }, [loadFunds]);

  return (
    <div>
      <Topbar title="Delete Mutual Fund" description="Delete funds through the mutual fund admin service." />
      <ManageFundsTable funds={funds} />
    </div>
  );
}
