"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionsController_1 = require("../controllers/transactionsController");
const router = (0, express_1.Router)();
router.get("/", transactionsController_1.listTransactions);
router.post("/", transactionsController_1.createTransactionHandler);
exports.default = router;
