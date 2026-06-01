import { useEffect } from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { Topbar } from "@/components/layout/Topbar";
import { useMutualFunds } from "@/hooks/useMutualFunds";
import { formatCurrency } from "@/utils/formatCurrency";

const colors = ["#38bdf8", "#22c55e", "#f59e0b", "#ef4444", "#a78bfa"];

export default function FundInsights() {
  const { funds, analytics, loadFunds } = useMutualFunds();

  useEffect(() => {
    loadFunds();
  }, [loadFunds]);

  const typeData =
    analytics?.by_type.map((item) => ({ label: item.fund_type, value: Number(item.average_nav || 0) })) ||
    funds.map((fund) => ({ label: fund.fund_type || "Other", value: Number(fund.nav || 0) }));

  return (
    <div>
      <Topbar title="Mutual Fund Insights" description="NAV distribution, fund type analytics, and mutual fund health overview." />
      <div className="grid gap-6 xl:grid-cols-[1fr_.8fr]">
        <AdminAnalytics title="Average NAV by Type" data={typeData} />
        <div className="glass-card rounded-2xl p-5">
          <h3 className="mb-5 font-semibold text-white">Fund Mix</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={typeData} dataKey="value" nameKey="label" innerRadius={64} outerRadius={112} paddingAngle={4}>
                  {typeData.map((entry, index) => (
                    <Cell key={entry.label} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,.22)", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
