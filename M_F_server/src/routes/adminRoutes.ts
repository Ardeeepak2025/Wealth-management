import { Router } from "express";
import {
  deleteUser,
  setUserRole,
  createFundAdmin,
  deleteFundAdmin,
  listAllTransactionsAdmin,
} from "../controllers/adminController";
import { requireAdmin } from "../middleware/authMiddleware";

const router = Router();

router.use(requireAdmin);

router.delete("/users/:id", deleteUser);
router.patch("/users/:id/role", setUserRole);

router.post("/mutual-funds", createFundAdmin);
router.delete("/mutual-funds/:id", deleteFundAdmin);

router.get("/transactions", listAllTransactionsAdmin);

export default router;
