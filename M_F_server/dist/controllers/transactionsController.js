"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTransactions = listTransactions;
exports.createTransactionHandler = createTransactionHandler;
const transactionsModel_1 = require("../models/transactionsModel");
async function listTransactions(req, res) {
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    const transactions = await (0, transactionsModel_1.getTransactions)(userId);
    res.json(transactions);
}
async function createTransactionHandler(req, res) {
    const { user_id, mutual_fund_id, transaction_type, units, nav_price, total_amount, } = req.body;
    if (!user_id ||
        !mutual_fund_id ||
        !transaction_type ||
        !units ||
        !nav_price ||
        !total_amount) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    const id = await (0, transactionsModel_1.createTransaction)({
        user_id,
        mutual_fund_id,
        transaction_type,
        units,
        nav_price,
        total_amount,
    });
    res.status(201).json({ id, message: "Transaction created" });
}
