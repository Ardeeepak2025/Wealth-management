import supabase from "../db";

export interface Holding {
  id: number;
  user_id: number;
  mutual_fund_id: number;
  units: number;
  average_nav: number;
  total_investment: number;
  profit_loss: number;
  updated_at: string;
}

export async function getHoldings(): Promise<Holding[]> {
  const { data, error } = await supabase.from("mutual_fund_holdings").select("*");
  if (error) {
    throw error;
  }

  return (data ?? []) as Holding[];
}

export async function getHoldingsByUserId(userId: number): Promise<Holding[]> {
  const { data, error } = await supabase
    .from("mutual_fund_holdings")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return (data ?? []) as Holding[];
}

export async function getHoldingById(id: number): Promise<Holding | null> {
  const { data, error } = await supabase
    .from("mutual_fund_holdings")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as Holding | null) ?? null;
}
