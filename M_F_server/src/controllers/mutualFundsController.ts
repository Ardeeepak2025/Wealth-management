import { Request, Response } from "express";
import {
  createMutualFund,
  getMutualFundAnalytics,
  getMutualFundById,
  getMutualFunds,
} from "../models/mutualFundsModel";

export async function listFunds(_req: Request, res: Response) {
  const funds = await getMutualFunds();
  res.json(funds);
}

export async function getFund(req: Request, res: Response) {
  const id = Number(req.params.id);
  const fund = await getMutualFundById(id);
  if (!fund) {
    res.status(404).json({ message: "Fund not found" });
    return;
  }
  res.json(fund);
}

export async function createFund(req: Request, res: Response) {
  const { fund_name, fund_type, nav, highest_nav, lowest_nav } = req.body;
  if (!fund_name) {
    res.status(400).json({ message: "fund_name is required" });
    return;
  }

  const id = await createMutualFund({
    fund_name,
    fund_type: fund_type || null,
    nav: nav ?? null,
    highest_nav: highest_nav ?? null,
    lowest_nav: lowest_nav ?? null,
  });
  res.status(201).json({ id, message: "Fund created" });
}

export async function getFundAnalytics(_req: Request, res: Response) {
  const analytics = await getMutualFundAnalytics();
  res.json(analytics);
}
