import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Table } from "@/components/common/Table";
import { useStocks } from "@/hooks/useStocks";
import type { Stock } from "@/types/stock";
import { formatCurrency } from "@/utils/formatCurrency";

export function ManageStocksTable({ stocks }: { stocks: Stock[] }) {
  const { updateStockPrice, updateStockQuantity } = useStocks();
  const [editing, setEditing] = useState<Record<number, { price: number; quantity: number }>>({});

  function updateDraft(stock: Stock, key: "price" | "quantity", value: number) {
    setEditing((current) => ({
      ...current,
      [stock.id]: {
        price: current[stock.id]?.price ?? stock.current_price,
        quantity: current[stock.id]?.quantity ?? stock.available_quantity,
        [key]: value,
      },
    }));
  }

  async function save(stock: Stock) {
    const draft = editing[stock.id];
    if (!draft) return;
    await updateStockPrice(stock.id, draft.price);
    await updateStockQuantity(stock.id, draft.quantity);
  }

  return (
    <div className="glass-card rounded-2xl p-5">
      <Table
        data={stocks}
        keyExtractor={(row) => row.id}
        columns={[
          { key: "symbol", header: "Symbol" },
          { key: "company_name", header: "Company" },
          { key: "price", header: "Price", render: (row) => <Input type="number" value={editing[row.id]?.price ?? row.current_price} onChange={(event) => updateDraft(row, "price", Number(event.target.value))} /> },
          { key: "quantity", header: "Quantity", render: (row) => <Input type="number" value={editing[row.id]?.quantity ?? row.available_quantity} onChange={(event) => updateDraft(row, "quantity", Number(event.target.value))} /> },
          { key: "current", header: "Current", render: (row) => formatCurrency(row.current_price) },
          { key: "action", header: "Action", render: (row) => <Button variant="secondary" onClick={() => save(row)}>Save</Button> },
        ]}
      />
    </div>
  );
}
