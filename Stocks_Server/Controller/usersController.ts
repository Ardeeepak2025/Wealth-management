import { Request, Response } from "express";
import { supabase } from "../Database/db";

const internalSyncSecret = process.env.INTERNAL_SYNC_SECRET || "dev-internal-sync-secret";

const isAuthorizedInternalRequest = (request: Request): boolean => {
  const providedSecret = String(request.header("x-internal-sync-secret") || "");
  return providedSecret === internalSyncSecret;
};

const parsePositiveNumber = (value: unknown): number | null => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const ensureWallet = async (userId: number): Promise<void> => {
  const { data: wallet, error: walletError } = await supabase
    .from("wallet")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (walletError) {
    throw walletError;
  }

  if (!wallet) {
    const { error } = await supabase.from("wallet").insert({
      user_id: userId,
      balance: 100000,
      updated_at: new Date(),
    });

    if (error) {
      throw error;
    }
  }
};

const ensurePortfolioSummary = async (userId: number): Promise<void> => {
  const { data: summary, error: summaryError } = await supabase
    .from("portfolio_summary")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (summaryError) {
    throw summaryError;
  }

  if (!summary) {
    const { error } = await supabase.from("portfolio_summary").insert({
      user_id: userId,
      total_investment: 0,
      current_value: 0,
      total_profit: 0,
      updated_at: new Date(),
    });

    if (error) {
      throw error;
    }
  }
};

export const syncUser = async (request: Request, response: Response): Promise<void> => {
  try {
    if (!isAuthorizedInternalRequest(request)) {
      response.status(401).json({ message: "Invalid internal sync secret" });
      return;
    }

    const id = parsePositiveNumber(request.body?.id);
    const name = String(request.body?.name || "").trim();
    const email = String(request.body?.email || "").trim().toLowerCase();
    const password = String(request.body?.password || "");
    const role = String(request.body?.role || "USER").trim().toUpperCase();

    if (!id || !name || !email || !password) {
      response.status(400).json({ message: "id, name, email and password are required" });
      return;
    }

    const { data: existingById, error: existingByIdError } = await supabase
      .from("users")
      .select("id, email")
      .eq("id", id)
      .maybeSingle();

    if (existingByIdError) {
      throw existingByIdError;
    }

    const { data: existingByEmail, error: existingByEmailError } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", email)
      .maybeSingle();

    if (existingByEmailError) {
      throw existingByEmailError;
    }

    if (existingById && String(existingById.email).toLowerCase() !== email) {
      response.status(409).json({ message: "User id already belongs to another email" });
      return;
    }

    if (existingByEmail && Number(existingByEmail.id) !== id) {
      response.status(409).json({ message: "Email already belongs to another user id" });
      return;
    }

    if (existingById || existingByEmail) {
      const { error } = await supabase
        .from("users")
        .update({ name, email, password, role })
        .eq("id", id);

      if (error) {
        throw error;
      }
    } else {
      const { error } = await supabase.from("users").insert({
        id,
        name,
        email,
        password,
        role,
      });

      if (error) {
        throw error;
      }
    }

    await ensureWallet(id);
    await ensurePortfolioSummary(id);

    response.status(200).json({ message: "User synced", user: { id, name, email, role } });
  } catch (error: any) {
    response.status(500).json({ message: error.message || "Internal server error" });
  }
};
