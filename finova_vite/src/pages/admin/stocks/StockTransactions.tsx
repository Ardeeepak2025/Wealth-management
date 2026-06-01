import { useEffect, useState } from "react";
import { TransactionsTable } from "@/components/admin/TransactionsTable";
import { Loader } from "@/components/common/Loader";
import { Topbar } from "@/components/layout/Topbar";
import { stockService } from "@/services/stockService";
import type { StockTransaction } from "@/types/stock";
import { fallbackTransactions } from "@/utils/constants";

export default function StockTransactions() {
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    stockService
      .getAdminTransactions()
      .then(setTransactions)
      .catch(() => setTransactions(fallbackTransactions))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Topbar title="Stock Transactions" description="All stock buy/sell transactions from admin endpoint." />
      {loading ? <Loader /> : <TransactionsTable transactions={transactions} />}
    </div>
  );
}
