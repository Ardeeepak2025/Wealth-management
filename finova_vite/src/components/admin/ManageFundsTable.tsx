import { Button } from "@/components/common/Button";
import { Table } from "@/components/common/Table";
import { useMutualFunds } from "@/hooks/useMutualFunds";
import type { MutualFund } from "@/types/mutualfund";
import { formatCurrency } from "@/utils/formatCurrency";

export function ManageFundsTable({ funds }: { funds: MutualFund[] }) {
  const { deleteFund } = useMutualFunds();
  return (
    <div className="glass-card rounded-2xl p-5">
      <Table
        data={funds}
        keyExtractor={(row) => row.id}
        columns={[
          { key: "fund_name", header: "Fund" },
          { key: "fund_type", header: "Type" },
          { key: "nav", header: "NAV", render: (row) => formatCurrency(row.nav || 0) },
          { key: "highest_nav", header: "High", render: (row) => formatCurrency(row.highest_nav || 0) },
          { key: "lowest_nav", header: "Low", render: (row) => formatCurrency(row.lowest_nav || 0) },
          { key: "action", header: "Action", render: (row) => <Button variant="danger" onClick={() => deleteFund(row.id)}>Delete</Button> },
        ]}
      />
    </div>
  );
}
