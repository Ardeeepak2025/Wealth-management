import { Table } from "@/components/common/Table";
import type { FundTransaction } from "@/types/mutualfund";
import type { StockTransaction } from "@/types/stock";
import { formatCurrency } from "@/utils/formatCurrency";

type Tx = StockTransaction | FundTransaction;

function getName(row: Tx): string {
  if ("symbol" in row) return row.symbol || row.company_name || "Stock";
  return `Fund #${row.mutual_fund_id}`;
}

function getAmount(row: Tx): number {
  return "total_amount" in row ? row.total_amount : 0;
}

function getType(row: Tx): string {
  return "transaction_type" in row ? row.transaction_type : "BUY";
}

export function RecentTransactions({ transactions }: { transactions: Tx[] }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-5">
        <h3 className="font-semibold text-white">Recent Transactions</h3>
        <p className="text-sm text-slate-400">Latest trading activity</p>
      </div>
      <Table
        data={transactions.slice(0, 6)}
        keyExtractor={(row) => row.id}
        columns={[
          { key: "asset", header: "Asset", render: (row) => getName(row) },
          {
            key: "type",
            header: "Type",
            render: (row) => <span className={getType(row) === "BUY" ? "text-green-300" : "text-red-300"}>{getType(row)}</span>,
          },
          { key: "total", header: "Amount", render: (row) => formatCurrency(getAmount(row)) },
        ]}
      />
    </div>
  );
}
