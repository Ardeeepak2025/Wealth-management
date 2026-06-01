import type { ChartPoint } from "./stock";

export interface MutualFund {
  id: number;
  fund_name: string;
  fund_type: string | null;
  nav: number | null;
  highest_nav: number | null;
  lowest_nav: number | null;
  created_at?: string;
}

export interface MutualFundAnalyticsByType {
  fund_type: string;
  fund_count: number;
  total_nav: number;
  average_nav: number | null;
  highest_nav: number | null;
  lowest_nav: number | null;
}

export interface MutualFundAnalytics {
  overview: {
    total_funds: number;
    funds_with_nav: number;
    average_nav: number | null;
    highest_nav: number | null;
    lowest_nav: number | null;
    average_highest_nav: number | null;
    average_lowest_nav: number | null;
  };
  by_type: MutualFundAnalyticsByType[];
  funds: Array<MutualFund & { nav_spread: number | null; nav_position: string | null }>;
}

export interface FundHolding {
  id: number;
  user_id: number;
  mutual_fund_id: number;
  units: number;
  average_nav: number;
  total_investment: number;
  profit_loss: number;
  updated_at: string;
}

export interface FundTransaction {
  id: number;
  user_id: number;
  mutual_fund_id: number;
  transaction_type: "BUY" | "SELL";
  units: number;
  nav_price: number;
  total_amount: number;
  created_at: string;
}

export interface FundOrderPayload {
  mutual_fund_id: number;
  transaction_type: "BUY" | "SELL";
  units: number;
  nav_price: number;
  total_amount: number;
}

export interface AddFundPayload {
  fund_name: string;
  fund_type: string;
  nav: number;
  highest_nav: number;
  lowest_nav: number;
}

export interface SipProjection {
  points: ChartPoint[];
  maturityValue: number;
  investedAmount: number;
  estimatedReturns: number;
}
