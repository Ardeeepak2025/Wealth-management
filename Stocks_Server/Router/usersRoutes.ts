import express from "express";
import { syncUser } from "../Controller/usersController";

const router = express.Router();

router.post("/sync", syncUser);

export default router;
