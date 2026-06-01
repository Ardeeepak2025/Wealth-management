import type { MutualFund } from "@/types/mutualfund";
import type { Property } from "@/types/realestate";
import type { DashboardSummary, LeaderboardEntry, Stock, StockHolding, StockTransaction } from "@/types/stock";
import { makeTrend } from "./chartUtils";

export const APP_NAME = "Finova";

export const DEFAULT_STOCK_API = import.meta.env.VITE_STOCK_API_URL || "http://localhost:3000";
export const DEFAULT_MF_API = import.meta.env.VITE_MUTUAL_FUND_API_URL || "http://localhost:3001";
export const DEFAULT_GATEWAY_API = import.meta.env.VITE_GATEWAY_API_URL || "http://localhost:4000";

export const fallbackStocks: Stock[] = [
  {
    id: 1,
    symbol: "TCS",
    company_name: "Tata Consultancy Services",
    sector: "Technology",
    current_price: 3890,
    highest_price: 3975,
    lowest_price: 3712,
    available_quantity: 2400,
    day_change_percent: 1.84,
    market_cap: 14200000000000,
    volume: 1840000,
  },
  {
    id: 2,
    symbol: "HDFCBANK",
    company_name: "HDFC Bank",
    sector: "Banking",
    current_price: 1664,
    highest_price: 1711,
    lowest_price: 1628,
    available_quantity: 5100,
    day_change_percent: -0.62,
    market_cap: 12600000000000,
    volume: 2740000,
  },
  {
    id: 3,
    symbol: "INFY",
    company_name: "Infosys",
    sector: "Technology",
    current_price: 1518,
    highest_price: 1542,
    lowest_price: 1467,
    available_quantity: 3900,
    day_change_percent: 2.24,
    market_cap: 6300000000000,
    volume: 2140000,
  },
];

export const fallbackHoldings: StockHolding[] = [
  {
    id: 1,
    stock_id: 1,
    symbol: "TCS",
    company_name: "Tata Consultancy Services",
    sector: "Technology",
    current_price: 3890,
    highest_price: 3975,
    lowest_price: 3712,
    quantity: 8,
    average_buy_price: 3610,
    total_investment: 28880,
    current_value: 31120,
    profit_loss: 2240,
  },
  {
    id: 2,
    stock_id: 3,
    symbol: "INFY",
    company_name: "Infosys",
    sector: "Technology",
    current_price: 1518,
    highest_price: 1542,
    lowest_price: 1467,
    quantity: 15,
    average_buy_price: 1460,
    total_investment: 21900,
    current_value: 22770,
    profit_loss: 870,
  },
];

export const fallbackTransactions: StockTransaction[] = [
  {
    id: 1,
    symbol: "TCS",
    company_name: "Tata Consultancy Services",
    transaction_type: "BUY",
    quantity: 2,
    price: 3890,
    total_amount: 7780,
    created_at: "2026-05-20",
  },
  {
    id: 2,
    symbol: "INFY",
    company_name: "Infosys",
    transaction_type: "SELL",
    quantity: 3,
    price: 1518,
    total_amount: 4554,
    created_at: "2026-05-18",
  },
];

export const fallbackSummary: DashboardSummary = {
  walletBalance: 125000,
  totalInvestment: 50780,
  totalStockValue: 53890,
  netWorth: 178890,
  totalProfitLoss: 3110,
  totalHoldings: 2,
  recentTransactions: fallbackTransactions,
};

export const fallbackLeaderboard: LeaderboardEntry[] = [
  { id: 1, name: "Aarav Sharma", wallet_balance: 120000, stock_value: 340000, net_worth: 460000 },
  { id: 2, name: "Meera Iyer", wallet_balance: 96000, stock_value: 310000, net_worth: 406000 },
  { id: 3, name: "Dev Patel", wallet_balance: 74000, stock_value: 240000, net_worth: 314000 },
];

export const fallbackFunds: MutualFund[] = [
  { id: 1, fund_name: "Finova Bluechip Growth", fund_type: "Large Cap", nav: 182.42, highest_nav: 190.2, lowest_nav: 141.8 },
  { id: 2, fund_name: "Finova Flexi Wealth", fund_type: "Flexi Cap", nav: 96.7, highest_nav: 102.9, lowest_nav: 72.6 },
  { id: 3, fund_name: "Finova Balanced Advantage", fund_type: "Hybrid", nav: 64.2, highest_nav: 66.3, lowest_nav: 51.9 },
];

export const fallbackProperties: Property[] = [
  {
    id: 1,
    ownerId: 1,
    title: "Koramangala Premium Loft",
    location: "Bengaluru",
    propertyType: "Apartment",
    purchasePrice: 12500000,
    currentValue: 15100000,
    rentEstimate: 68000,
  },
  {
    id: 2,
    ownerId: 1,
    title: "Gurugram Commercial Suite",
    location: "Gurugram",
    propertyType: "Commercial",
    purchasePrice: 18200000,
    currentValue: 20900000,
    rentEstimate: 145000,
  },
];

export const fallbackTrend = makeTrend(3890);
