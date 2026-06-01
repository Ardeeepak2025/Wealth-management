import { useEffect } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { LeaderboardTable } from "@/components/stocks/LeaderboardTable";
import { useStocks } from "@/hooks/useStocks";

export default function Leaderboard() {
  const { leaderboard, loadMarketMovers } = useStocks();

  useEffect(() => {
    loadMarketMovers();
  }, [loadMarketMovers]);

  return (
    <div>
      <Topbar title="Leaderboard" description="Top investors ranked by wallet balance plus stock portfolio value." />
      <LeaderboardTable data={leaderboard} />
    </div>
  );
}
