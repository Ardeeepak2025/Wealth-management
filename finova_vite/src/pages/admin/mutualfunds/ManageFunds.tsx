import { useEffect } from "react";
import { ManageFundsTable } from "@/components/admin/ManageFundsTable";
import { Topbar } from "@/components/layout/Topbar";
import { useMutualFunds } from "@/hooks/useMutualFunds";

export default function ManageFunds() {
  const { funds, loadFunds } = useMutualFunds();

  useEffect(() => {
    loadFunds();
  }, [loadFunds]);

  return (
    <div>
      <Topbar title="Manage Mutual Funds" description="View and remove mutual fund records." onRefresh={loadFunds} />
      <ManageFundsTable funds={funds} />
    </div>
  );
}
