import { Table } from "@/components/common/Table";
import type { LeaderboardEntry } from "@/types/stock";
import { formatCurrency } from "@/utils/formatCurrency";

export function LeaderboardTable({ data }: { data: LeaderboardEntry[] }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <Table
        data={data}
        keyExtractor={(row) => row.id}
        columns={[
          { key: "rank", header: "Rank", render: (_row, index) => `#${index + 1}` },
          { key: "name", header: "Investor" },
          { key: "wallet_balance", header: "Wallet", render: (row) => formatCurrency(row.wallet_balance) },
          { key: "stock_value", header: "Stock Value", render: (row) => formatCurrency(row.stock_value) },
          { key: "net_worth", header: "Net Worth", render: (row) => <span className="font-semibold text-sky-300">{formatCurrency(row.net_worth)}</span> },
        ]}
      />
    </div>
  );
}
