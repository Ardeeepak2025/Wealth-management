import { Router } from "express";
import { getSummary } from "../controllers/summaryController";

const router = Router();

router.get("/:userId", getSummary);

export default router;
