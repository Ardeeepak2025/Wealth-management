import { Link } from "react-router-dom";
import { Table } from "@/components/common/Table";
import type { StockHolding } from "@/types/stock";
import { formatCurrency } from "@/utils/formatCurrency";

export function HoldingsWidget({ holdings }: { holdings: StockHolding[] }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white">Top Holdings</h3>
          <p className="text-sm text-slate-400">Your largest stock positions</p>
        </div>
        <Link className="text-sm font-semibold text-sky-300 hover:text-sky-200" to="/stocks/holdings">
          View all
        </Link>
      </div>
      <Table
        data={holdings.slice(0, 5)}
        keyExtractor={(row) => row.id}
        columns={[
          { key: "symbol", header: "Symbol" },
          { key: "quantity", header: "Qty" },
          { key: "current_value", header: "Value", render: (row) => formatCurrency(row.current_value) },
          {
            key: "profit_loss",
            header: "P/L",
            render: (row) => <span className={row.profit_loss >= 0 ? "text-green-300" : "text-red-300"}>{formatCurrency(row.profit_loss)}</span>,
          },
        ]}
      />
    </div>
  );
}
