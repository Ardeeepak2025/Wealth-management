import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "@/components/common/Loader";
import { Topbar } from "@/components/layout/Topbar";
import { StockChart } from "@/components/stocks/StockChart";
import { stockService } from "@/services/stockService";
import type { ChartPoint, Stock, StockHistoryPoint } from "@/types/stock";
import { fallbackStocks } from "@/utils/constants";
import { formatCurrency, formatPercent } from "@/utils/formatCurrency";

export default function StockDetails() {
  const { id } = useParams();
  const [stock, setStock] = useState<Stock | null>(null);
  const [history, setHistory] = useState<StockHistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stockId = Number(id);
    if (!stockId) return;
    setLoading(true);
    stockService
      .getStockInfo(stockId)
      .then((response) => {
        setStock(response.stock);
        setHistory(response.graph_data || []);
      })
      .catch(async () => {
        const fallback = fallbackStocks.find((item) => item.id === stockId) || fallbackStocks[0];
        setStock(fallback);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const chartData: ChartPoint[] = useMemo(
    () =>
      history.length
        ? history.map((point) => ({ label: new Date(point.created_at).toLocaleDateString(), value: Number(point.new_price) }))
        : [],
    [history],
  );

  if (loading || !stock) return <Loader label="Loading stock details" />;

  return (
    <div>
      <Topbar title={`${stock.symbol} Details`} description={stock.company_name} />
      <div className="grid gap-6 xl:grid-cols-[1.4fr_.8fr]">
        <div className="glass-card rounded-2xl p-5">
          <StockChart data={chartData.length ? chartData : undefined} height={360} />
        </div>
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-xl font-bold text-white">{stock.company_name}</h3>
          <p className="mt-1 text-sm text-slate-400">{stock.sector}</p>
          <div className="mt-6 space-y-3">
            <Detail label="Current Price" value={formatCurrency(stock.current_price)} />
            <Detail label="Day Change" value={formatPercent(stock.day_change_percent || 0)} />
            <Detail label="High" value={formatCurrency(stock.highest_price)} />
            <Detail label="Low" value={formatCurrency(stock.lowest_price)} />
            <Detail label="Available Quantity" value={String(stock.available_quantity)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
