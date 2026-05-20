import { Router } from "express";
import { getHolding, listHoldings } from "../controllers/holdingsController";

const router = Router();

router.get("/", listHoldings);
router.get("/:id", getHolding);

export default router;
