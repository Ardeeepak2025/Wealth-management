import { useEffect, useState } from "react";
import { TransactionsTable } from "@/components/admin/TransactionsTable";
import { Loader } from "@/components/common/Loader";
import { Topbar } from "@/components/layout/Topbar";
import { mutualFundService } from "@/services/mutualFundService";
import type { FundTransaction } from "@/types/mutualfund";

export default function FundTransactions() {
  const [transactions, setTransactions] = useState<FundTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mutualFundService
      .getAdminTransactions()
      .then((response) => setTransactions(response.transactions || []))
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Topbar title="Mutual Fund Transactions" description="All mutual fund transactions from admin endpoint." />
      {loading ? <Loader /> : <TransactionsTable transactions={transactions} />}
    </div>
  );
}
