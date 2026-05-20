import { Request, Response } from "express";
import {
  createTransaction,
  getTransactions,
} from "../models/transactionsModel";

export async function listTransactions(req: Request, res: Response) {
  const userId = req.query.userId ? Number(req.query.userId) : undefined;
  const transactions = await getTransactions(userId);
  res.json(transactions);
}

export async function createTransactionHandler(req: Request, res: Response) {
  const {
    user_id,
    mutual_fund_id,
    transaction_type,
    units,
    nav_price,
    total_amount,
  } = req.body;
  if (
    !user_id ||
    !mutual_fund_id ||
    !transaction_type ||
    !units ||
    !nav_price ||
    !total_amount
  ) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const id = await createTransaction({
    user_id,
    mutual_fund_id,
    transaction_type,
    units,
    nav_price,
    total_amount,
  });
  res.status(201).json({ id, message: "Transaction created" });
}
