import { Table } from "@/components/common/Table";
import type { StockHolding } from "@/types/stock";
import { formatCurrency } from "@/utils/formatCurrency";

export function HoldingsTable({ holdings }: { holdings: StockHolding[] }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <Table
        data={holdings}
        keyExtractor={(row) => row.id}
        columns={[
          { key: "symbol", header: "Symbol" },
          { key: "company_name", header: "Company" },
          { key: "quantity", header: "Qty" },
          { key: "average_buy_price", header: "Avg Price", render: (row) => formatCurrency(row.average_buy_price) },
          { key: "current_price", header: "Current", render: (row) => formatCurrency(row.current_price) },
          { key: "current_value", header: "Value", render: (row) => formatCurrency(row.current_value) },
          {
            key: "profit_loss",
            header: "Profit / Loss",
            render: (row) => <span className={row.profit_loss >= 0 ? "text-green-300" : "text-red-300"}>{formatCurrency(row.profit_loss)}</span>,
          },
        ]}
      />
    </div>
  );
}
