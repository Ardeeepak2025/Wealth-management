import { Router } from "express";
import {
  createFund,
  getFundAnalytics,
  getFund,
  listFunds,
} from "../controllers/mutualFundsController";

const router = Router();

router.get("/", listFunds);
router.get("/analytics", getFundAnalytics);
router.get("/:id", getFund);
router.post("/", createFund);

export default router;
