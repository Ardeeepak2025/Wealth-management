import { Table } from "@/components/common/Table";
import type { FundTransaction } from "@/types/mutualfund";
import type { StockTransaction } from "@/types/stock";
import { formatCurrency } from "@/utils/formatCurrency";

type AnyTransaction = StockTransaction | FundTransaction;

export function TransactionsTable({ transactions }: { transactions: AnyTransaction[] }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <Table
        data={transactions}
        keyExtractor={(row) => row.id}
        columns={[
          { key: "asset", header: "Asset", render: (row) => ("symbol" in row ? row.symbol || row.company_name : `Fund #${row.mutual_fund_id}`) },
          { key: "type", header: "Type", render: (row) => row.transaction_type },
          { key: "qty", header: "Qty / Units", render: (row) => ("quantity" in row ? row.quantity : row.units.toFixed(3)) },
          { key: "amount", header: "Amount", render: (row) => formatCurrency(row.total_amount) },
          { key: "date", header: "Date", render: (row) => new Date(row.created_at).toLocaleDateString() },
        ]}
      />
    </div>
  );
}
