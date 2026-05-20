import supabase from "../db";

export interface Transaction {
  id: number;
  user_id: number;
  mutual_fund_id: number;
  transaction_type: "BUY" | "SELL";
  units: number;
  nav_price: number;
  total_amount: number;
  created_at: string;
}

export async function getTransactions(userId?: number): Promise<Transaction[]> {
  if (userId) {
    const { data, error } = await supabase
      .from("mutual_fund_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []) as Transaction[];
  }

  const { data, error } = await supabase
    .from("mutual_fund_transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as Transaction[];
}

export async function createTransaction(
  data: Omit<Transaction, "id" | "created_at">,
): Promise<number> {
  const { data: insertedRows, error } = await supabase
    .from("mutual_fund_transactions")
    .insert({
      user_id: data.user_id,
      mutual_fund_id: data.mutual_fund_id,
      transaction_type: data.transaction_type,
      units: data.units,
      nav_price: data.nav_price,
      total_amount: data.total_amount,
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return insertedRows.id;
}
