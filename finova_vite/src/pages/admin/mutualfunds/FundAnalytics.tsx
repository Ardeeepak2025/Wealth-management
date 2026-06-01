import { useEffect } from "react";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { Topbar } from "@/components/layout/Topbar";
import { useMutualFunds } from "@/hooks/useMutualFunds";

export default function FundAnalytics() {
  const { funds, analytics, loadFunds } = useMutualFunds();

  useEffect(() => {
    loadFunds();
  }, [loadFunds]);

  const data =
    analytics?.by_type.map((item) => ({ label: item.fund_type, value: Number(item.average_nav || 0) })) ||
    funds.map((fund) => ({ label: fund.fund_name.slice(0, 12), value: Number(fund.nav || 0) }));

  return (
    <div>
      <Topbar title="Mutual Fund Analytics" description="Admin overview of NAV and fund category performance." />
      <AdminAnalytics title="NAV Analytics" data={data} />
    </div>
  );
}
