import { Table } from "@/components/common/Table";
import type { FundHolding, MutualFund } from "@/types/mutualfund";
import { formatCurrency } from "@/utils/formatCurrency";

export function FundHoldings({ holdings, funds }: { holdings: FundHolding[]; funds: MutualFund[] }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <Table
        data={holdings}
        keyExtractor={(row) => row.id}
        columns={[
          { key: "fund", header: "Fund", render: (row) => funds.find((fund) => fund.id === row.mutual_fund_id)?.fund_name || `Fund #${row.mutual_fund_id}` },
          { key: "units", header: "Units", render: (row) => row.units.toFixed(4) },
          { key: "average_nav", header: "Avg NAV", render: (row) => formatCurrency(row.average_nav) },
          { key: "total_investment", header: "Investment", render: (row) => formatCurrency(row.total_investment) },
          { key: "profit_loss", header: "P/L", render: (row) => <span className={row.profit_loss >= 0 ? "text-green-300" : "text-red-300"}>{formatCurrency(row.profit_loss)}</span> },
        ]}
      />
    </div>
  );
}
