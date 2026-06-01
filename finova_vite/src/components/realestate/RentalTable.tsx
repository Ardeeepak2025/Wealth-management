import { Table } from "@/components/common/Table";
import type { RentRecord } from "@/types/realestate";
import { formatCurrency } from "@/utils/formatCurrency";

export function RentalTable({ rents }: { rents: RentRecord[] }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <Table
        data={rents}
        keyExtractor={(row) => row.id}
        columns={[
          { key: "tenant", header: "Tenant", render: (row) => row.tenant || "Tenant" },
          { key: "amount", header: "Amount", render: (row) => formatCurrency(row.amount) },
          { key: "paidOn", header: "Paid On", render: (row) => new Date(row.paidOn).toLocaleDateString() },
        ]}
      />
    </div>
  );
}
