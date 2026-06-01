import { Request, Response } from "express";
import {
  getHoldingById,
  getHoldings,
  getHoldingsByUserId,
} from "../models/holdingsModel";

export async function listHoldings(req: Request, res: Response) {
  const userId = req.query.userId ? Number(req.query.userId) : null;
  if (userId) {
    const holdings = await getHoldingsByUserId(userId);
    res.json(holdings);
    return;
  }

  const holdings = await getHoldings();
  res.json(holdings);
}

export async function getHolding(req: Request, res: Response) {
  const id = Number(req.params.id);
  const holding = await getHoldingById(id);
  if (!holding) {
    res.status(404).json({ message: "Holding not found" });
    return;
  }
  res.json(holding);
}
