import { createContext, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/services/axios";
import { stockService } from "@/services/stockService";
import {
  fallbackHoldings,
  fallbackLeaderboard,
  fallbackStocks,
  fallbackSummary,
  fallbackTransactions,
} from "@/utils/constants";
import type {
  AddStockPayload,
  DashboardSummary,
  LeaderboardEntry,
  Stock,
  StockHolding,
  StockOrderPayload,
  StockTransaction,
} from "@/types/stock";

interface StockContextValue {
  stocks: Stock[];
  holdings: StockHolding[];
  summary: DashboardSummary;
  topGainers: Stock[];
  topLosers: Stock[];
  leaderboard: LeaderboardEntry[];
  transactions: StockTransaction[];
  loading: boolean;
  error: string | null;
  loadStocks: () => Promise<void>;
  loadDashboardData: (userId: number) => Promise<void>;
  loadMarketMovers: () => Promise<void>;
  buyStock: (userId: number, payload: StockOrderPayload) => Promise<void>;
  sellStock: (userId: number, payload: StockOrderPayload) => Promise<void>;
  addStock: (payload: AddStockPayload) => Promise<void>;
  updateStockPrice: (stockId: number, price: number) => Promise<void>;
  updateStockQuantity: (stockId: number, quantity: number) => Promise<void>;
  deleteStock: (stockId: number) => Promise<void>;
}

export const StockContext = createContext<StockContextValue | undefined>(undefined);

export function StockProvider({ children }: { children: React.ReactNode }) {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [holdings, setHoldings] = useState<StockHolding[]>([]);
  const [summary, setSummary] = useState<DashboardSummary>(fallbackSummary);
  const [topGainers, setTopGainers] = useState<Stock[]>([]);
  const [topLosers, setTopLosers] = useState<Stock[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const withLoading = useCallback(async (task: () => Promise<void>) => {
    setLoading(true);
    setError(null);
    try {
      await task();
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStocks = useCallback(
    () =>
      withLoading(async () => {
        try {
          setStocks(await stockService.getAllStocks());
        } catch {
          setStocks(fallbackStocks);
        }
      }),
    [withLoading],
  );

  const loadDashboardData = useCallback(
    (userId: number) =>
      withLoading(async () => {
        try {
          const [nextSummary, nextHoldings, nextTransactions] = await Promise.all([
            stockService.getDashboardSummary(userId),
            stockService.getHoldings(userId),
            stockService.getAdminTransactions().catch(() => fallbackTransactions),
          ]);
          setSummary(nextSummary || fallbackSummary);
          setHoldings(nextHoldings.length ? nextHoldings : fallbackHoldings);
          setTransactions(nextTransactions.length ? nextTransactions : fallbackTransactions);
        } catch {
          setSummary(fallbackSummary);
          setHoldings(fallbackHoldings);
          setTransactions(fallbackTransactions);
        }
      }),
    [withLoading],
  );

  const loadMarketMovers = useCallback(
    () =>
      withLoading(async () => {
        try {
          const [gainers, losers, leaders] = await Promise.all([
            stockService.getTopGainers(),
            stockService.getTopLosers(),
            stockService.getLeaderboard(),
          ]);
          setTopGainers(gainers);
          setTopLosers(losers);
          setLeaderboard(leaders);
        } catch {
          setTopGainers(fallbackStocks.filter((stock) => Number(stock.day_change_percent) >= 0));
          setTopLosers(fallbackStocks.filter((stock) => Number(stock.day_change_percent) < 0));
          setLeaderboard(fallbackLeaderboard);
        }
      }),
    [withLoading],
  );

  async function buyStock(userId: number, payload: StockOrderPayload) {
    await stockService.buyStock(userId, payload);
    toast.success("Stock purchase placed");
    await loadDashboardData(userId);
  }

  async function sellStock(userId: number, payload: StockOrderPayload) {
    await stockService.sellStock(userId, payload);
    toast.success("Stock sell order placed");
    await loadDashboardData(userId);
  }

  async function addStock(payload: AddStockPayload) {
    await stockService.addStock(payload);
    toast.success("Stock added");
    await loadStocks();
  }

  async function updateStockPrice(stockId: number, price: number) {
    await stockService.updateStockPrice(stockId, price);
    toast.success("Stock price updated");
    await loadStocks();
  }

  async function updateStockQuantity(stockId: number, quantity: number) {
    await stockService.updateStockQuantity(stockId, quantity);
    toast.success("Stock quantity updated");
    await loadStocks();
  }

  async function deleteStock(stockId: number) {
    await stockService.deleteStock(stockId);
    toast.success("Stock deleted");
    await loadStocks();
  }

  const value = useMemo(
    () => ({
      stocks,
      holdings,
      summary,
      topGainers,
      topLosers,
      leaderboard,
      transactions,
      loading,
      error,
      loadStocks,
      loadDashboardData,
      loadMarketMovers,
      buyStock,
      sellStock,
      addStock,
      updateStockPrice,
      updateStockQuantity,
      deleteStock,
    }),
    [stocks, holdings, summary, topGainers, topLosers, leaderboard, transactions, loading, error, loadStocks, loadDashboardData, loadMarketMovers],
  );

  return <StockContext.Provider value={value}>{children}</StockContext.Provider>;
}
