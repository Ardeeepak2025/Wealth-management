export interface ChartPoint {
  label: string;
  value: number;
}

export interface Stock {
  id: number;
  symbol: string;
  company_name: string;
  sector: string;
  current_price: number;
  highest_price: number;
  lowest_price: number;
  available_quantity: number;
  day_change_percent?: number;
  market_cap?: number;
  volume?: number;
  created_at?: string;
  updated_at?: string;
}

export interface StockHistoryPoint {
  id: number;
  old_price: number;
  new_price: number;
  change_amount: number;
  change_percent: number;
  created_at: string;
}

export interface StockDetailsResponse {
  message?: string;
  stock: Stock;
  graph_data: StockHistoryPoint[];
}

export interface StockHolding {
  id: number;
  stock_id: number;
  symbol: string;
  company_name: string;
  sector: string;
  current_price: number;
  highest_price: number;
  lowest_price: number;
  quantity: number;
  average_buy_price: number;
  total_investment: number;
  profit_loss: number;
  current_value: number;
}

export interface StockTransaction {
  id: number;
  name?: string | null;
  symbol: string | null;
  company_name: string | null;
  transaction_type: "BUY" | "SELL";
  quantity: number;
  price: number;
  total_amount: number;
  created_at: string;
}

export interface DashboardSummary {
  walletBalance: number;
  totalInvestment: number;
  totalStockValue: number;
  netWorth: number;
  totalProfitLoss: number;
  totalHoldings: number;
  recentTransactions?: StockTransaction[];
  mostPerformingStock?: Partial<StockHolding> | null;
  leastPerformingStock?: Partial<StockHolding> | null;
}

export interface LeaderboardEntry {
  id: number;
  name: string;
  wallet_balance: number;
  stock_value: number;
  net_worth: number;
}

export interface StockOrderPayload {
  stock_id: number;
  quantity: number;
}

export interface AddStockPayload {
  symbol: string;
  company_name: string;
  current_price: number;
  highest_price: number;
  lowest_price: number;
  available_quantity: number;
  sector: string;
}
