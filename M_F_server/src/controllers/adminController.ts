import { Request, Response } from "express";
import supabase from "../db";

export async function deleteUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!id) {
    res.status(400).json({ message: "Invalid user id" });
    return;
  }

  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) {
    res.status(500).json({ message: "Failed to delete user", error: error.message });
    return;
  }

  res.json({ message: "User deleted" });
}

export async function setUserRole(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { role } = req.body;
  if (!id || !role) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }

  const { error } = await supabase.from("users").update({ role }).eq("id", id);
  if (error) {
    res.status(500).json({ message: "Failed to update role", error: error.message });
    return;
  }

  res.json({ message: "Role updated" });
}

export async function createFundAdmin(req: Request, res: Response) {
  const { fund_name, fund_type, nav, highest_nav, lowest_nav } = req.body;
  if (!fund_name) {
    res.status(400).json({ message: "fund_name is required" });
    return;
  }

  const { data, error } = await supabase
    .from("mutual_funds")
    .insert({ fund_name, fund_type, nav, highest_nav, lowest_nav })
    .select("id")
    .single();

  if (error) {
    res.status(500).json({ message: "Failed to create fund", error: error.message });
    return;
  }

  res.status(201).json({ id: data.id, message: "Fund created" });
}

export async function deleteFundAdmin(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!id) {
    res.status(400).json({ message: "Invalid fund id" });
    return;
  }

  const { error } = await supabase.from("mutual_funds").delete().eq("id", id);
  if (error) {
    res.status(500).json({ message: "Failed to delete fund", error: error.message });
    return;
  }

  res.json({ message: "Fund deleted" });
}

export async function listAllTransactionsAdmin(_req: Request, res: Response) {
  const { data, error } = await supabase.from("mutual_fund_transactions").select("*").order("created_at", { ascending: false });
  if (error) {
    res.status(500).json({ message: "Failed to list transactions", error: error.message });
    return;
  }

  res.json({ transactions: data });
}
