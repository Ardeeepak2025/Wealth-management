import { Request, Response } from "express";
import { getSummaryByUserId } from "../models/summaryModel";

export async function getSummary(req: Request, res: Response) {
  const userId = Number(req.params.userId);
  const summary = await getSummaryByUserId(userId);
  if (!summary) {
    res.status(404).json({ message: "Summary not found" });
    return;
  }
  res.json(summary);
}
