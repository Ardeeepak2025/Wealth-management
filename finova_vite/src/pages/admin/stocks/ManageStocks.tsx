import { useEffect } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { ManageStocksTable } from "@/components/admin/ManageStocksTable";
import { useStocks } from "@/hooks/useStocks";

export default function ManageStocks() {
  const { stocks, loadStocks } = useStocks();

  useEffect(() => {
    loadStocks();
  }, [loadStocks]);

  return (
    <div>
      <Topbar title="Manage Stocks" description="Update stock price and inventory quantities." onRefresh={loadStocks} />
      <ManageStocksTable stocks={stocks} />
    </div>
  );
}
