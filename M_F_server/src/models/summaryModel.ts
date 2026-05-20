import supabase from "../db";

export interface Summary {
  id: number;
  user_id: number;
  total_investment: number;
  current_value: number;
  total_profit: number;
  updated_at: string;
}

export async function getSummaryByUserId(
  userId: number,
): Promise<Summary | null> {
  const { data, error } = await supabase
    .from("mutual_fund_summary")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as Summary | null) ?? null;
}
