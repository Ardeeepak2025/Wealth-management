import { useEffect, useState } from "react";
import { Button } from "@/components/common/Button";
import { DeleteModal } from "@/components/admin/DeleteModal";
import { Table } from "@/components/common/Table";
import { Topbar } from "@/components/layout/Topbar";
import { useStocks } from "@/hooks/useStocks";
import type { Stock } from "@/types/stock";
import { formatCurrency } from "@/utils/formatCurrency";

export default function DeleteStock() {
  const { stocks, loadStocks, deleteStock } = useStocks();
  const [target, setTarget] = useState<Stock | null>(null);

  useEffect(() => {
    loadStocks();
  }, [loadStocks]);

  async function confirmDelete() {
    if (!target) return;
    await deleteStock(target.id);
    setTarget(null);
  }

  return (
    <div>
      <Topbar title="Delete Stock" description="Remove obsolete stock records from the stock service." />
      <div className="glass-card rounded-2xl p-5">
        <Table
          data={stocks}
          keyExtractor={(row) => row.id}
          columns={[
            { key: "symbol", header: "Symbol" },
            { key: "company_name", header: "Company" },
            { key: "current_price", header: "Price", render: (row) => formatCurrency(row.current_price) },
            { key: "action", header: "Action", render: (row) => <Button variant="danger" onClick={() => setTarget(row)}>Delete</Button> },
          ]}
        />
      </div>
      <DeleteModal open={Boolean(target)} title="Delete stock" description={`Delete ${target?.symbol || "this stock"} permanently?`} onClose={() => setTarget(null)} onConfirm={confirmDelete} />
    </div>
  );
}
