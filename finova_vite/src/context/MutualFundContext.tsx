import { createContext, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/services/axios";
import { mutualFundService } from "@/services/mutualFundService";
import { fallbackFunds } from "@/utils/constants";
import type {
  AddFundPayload,
  FundHolding,
  FundOrderPayload,
  FundTransaction,
  MutualFund,
  MutualFundAnalytics,
} from "@/types/mutualfund";

interface MutualFundContextValue {
  funds: MutualFund[];
  holdings: FundHolding[];
  transactions: FundTransaction[];
  analytics: MutualFundAnalytics | null;
  loading: boolean;
  error: string | null;
  loadFunds: () => Promise<void>;
  loadFundDashboard: (userId: number) => Promise<void>;
  buyFund: (userId: number, payload: FundOrderPayload) => Promise<void>;
  sellFund: (userId: number, payload: FundOrderPayload) => Promise<void>;
  addFund: (payload: AddFundPayload) => Promise<void>;
  deleteFund: (id: number) => Promise<void>;
}

export const MutualFundContext = createContext<MutualFundContextValue | undefined>(undefined);

export function MutualFundProvider({ children }: { children: React.ReactNode }) {
  const [funds, setFunds] = useState<MutualFund[]>([]);
  const [holdings, setHoldings] = useState<FundHolding[]>([]);
  const [transactions, setTransactions] = useState<FundTransaction[]>([]);
  const [analytics, setAnalytics] = useState<MutualFundAnalytics | null>(null);
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

  const loadFunds = useCallback(
    () =>
      withLoading(async () => {
        try {
          const [nextFunds, nextAnalytics] = await Promise.all([
            mutualFundService.getFunds(),
            mutualFundService.getAnalytics().catch(() => null),
          ]);
          setFunds(nextFunds.length ? nextFunds : fallbackFunds);
          setAnalytics(nextAnalytics);
        } catch {
          setFunds(fallbackFunds);
        }
      }),
    [withLoading],
  );

  const loadFundDashboard = useCallback(
    (userId: number) =>
      withLoading(async () => {
        const [nextHoldings, nextTransactions] = await Promise.all([
          mutualFundService.getHoldings(userId).catch(() => []),
          mutualFundService.getTransactions(userId).catch(() => []),
        ]);
        setHoldings(nextHoldings);
        setTransactions(nextTransactions);
      }),
    [withLoading],
  );

  async function buyFund(userId: number, payload: FundOrderPayload) {
    await mutualFundService.createTransaction(userId, { ...payload, transaction_type: "BUY" });
    toast.success("Mutual fund purchase recorded");
    await loadFundDashboard(userId);
  }

  async function sellFund(userId: number, payload: FundOrderPayload) {
    await mutualFundService.createTransaction(userId, { ...payload, transaction_type: "SELL" });
    toast.success("Mutual fund redemption recorded");
    await loadFundDashboard(userId);
  }

  async function addFund(payload: AddFundPayload) {
    await mutualFundService.createFundAdmin(payload);
    toast.success("Mutual fund added");
    await loadFunds();
  }

  async function deleteFund(id: number) {
    await mutualFundService.deleteFundAdmin(id);
    toast.success("Mutual fund deleted");
    await loadFunds();
  }

  const value = useMemo(
    () => ({
      funds,
      holdings,
      transactions,
      analytics,
      loading,
      error,
      loadFunds,
      loadFundDashboard,
      buyFund,
      sellFund,
      addFund,
      deleteFund,
    }),
    [funds, holdings, transactions, analytics, loading, error, loadFunds, loadFundDashboard],
  );

  return <MutualFundContext.Provider value={value}>{children}</MutualFundContext.Provider>;
}
