import { Router } from "express";
import {
  createTransactionHandler,
  listTransactions,
} from "../controllers/transactionsController";

const router = Router();

router.get("/", listTransactions);
router.post("/", createTransactionHandler);

export default router;
