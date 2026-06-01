import { Router } from "express";
import {
  createUserHandler,
  getUser,
  listUsers,
  touchUserLastActive,
} from "../controllers/usersController";

const router = Router();

router.get("/", listUsers);
router.get("/:id", getUser);
router.post("/", createUserHandler);
router.patch("/:id/last-active", touchUserLastActive);

export default router;
