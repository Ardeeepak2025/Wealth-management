import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { Pagination } from "@/components/common/Pagination";
import { Table } from "@/components/common/Table";
import type { Stock } from "@/types/stock";
import { formatCurrency, formatPercent } from "@/utils/formatCurrency";

export function StockTable({ stocks, onSelect }: { stocks: Stock[]; onSelect?: (stock: Stock) => void }) {
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const pagedStocks = useMemo(() => stocks.slice((page - 1) * pageSize, page * pageSize), [stocks, page]);

  return (
    <div className="glass-card rounded-2xl p-5">
      <Table
        data={pagedStocks}
        keyExtractor={(row) => row.id}
        columns={[
          { key: "symbol", header: "Symbol", render: (row) => <button className="font-semibold text-sky-300" onClick={() => onSelect?.(row)}>{row.symbol}</button> },
          { key: "company_name", header: "Company" },
          { key: "sector", header: "Sector" },
          { key: "current_price", header: "Price", render: (row) => formatCurrency(row.current_price) },
          {
            key: "day_change_percent",
            header: "Change",
            render: (row) => <span className={(row.day_change_percent || 0) >= 0 ? "text-green-300" : "text-red-300"}>{formatPercent(row.day_change_percent || 0)}</span>,
          },
          {
            key: "action",
            header: "Action",
            render: (row) => (
              <div className="flex gap-2">
                <Link to={`/stocks/${row.id}`}>
                  <Button variant="secondary">Open</Button>
                </Link>
              </div>
            ),
          },
        ]}
      />
      <div className="mt-4">
        <Pagination page={page} pageSize={pageSize} total={stocks.length} onPageChange={setPage} />
      </div>
    </div>
  );
}
