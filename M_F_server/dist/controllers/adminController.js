"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = deleteUser;
exports.setUserRole = setUserRole;
exports.createFundAdmin = createFundAdmin;
exports.deleteFundAdmin = deleteFundAdmin;
exports.listAllTransactionsAdmin = listAllTransactionsAdmin;
const db_1 = __importDefault(require("../db"));
async function deleteUser(req, res) {
    const id = Number(req.params.id);
    if (!id) {
        res.status(400).json({ message: "Invalid user id" });
        return;
    }
    const { error } = await db_1.default.from("users").delete().eq("id", id);
    if (error) {
        res.status(500).json({ message: "Failed to delete user", error: error.message });
        return;
    }
    res.json({ message: "User deleted" });
}
async function setUserRole(req, res) {
    const id = Number(req.params.id);
    const { role } = req.body;
    if (!id || !role) {
        res.status(400).json({ message: "Invalid request" });
        return;
    }
    const { error } = await db_1.default.from("users").update({ role }).eq("id", id);
    if (error) {
        res.status(500).json({ message: "Failed to update role", error: error.message });
        return;
    }
    res.json({ message: "Role updated" });
}
async function createFundAdmin(req, res) {
    const { fund_name, fund_type, nav, highest_nav, lowest_nav } = req.body;
    if (!fund_name) {
        res.status(400).json({ message: "fund_name is required" });
        return;
    }
    const { data, error } = await db_1.default
        .from("mutual_funds")
        .insert({ fund_name, fund_type, nav, highest_nav, lowest_nav })
        .select("id")
        .single();
    if (error) {
        res.status(500).json({ message: "Failed to create fund", error: error.message });
        return;
    }
    res.status(201).json({ id: data.id, message: "Fund created" });
}
async function deleteFundAdmin(req, res) {
    const id = Number(req.params.id);
    if (!id) {
        res.status(400).json({ message: "Invalid fund id" });
        return;
    }
    const { error } = await db_1.default.from("mutual_funds").delete().eq("id", id);
    if (error) {
        res.status(500).json({ message: "Failed to delete fund", error: error.message });
        return;
    }
    res.json({ message: "Fund deleted" });
}
async function listAllTransactionsAdmin(_req, res) {
    const { data, error } = await db_1.default.from("mutual_fund_transactions").select("*").order("created_at", { ascending: false });
    if (error) {
        res.status(500).json({ message: "Failed to list transactions", error: error.message });
        return;
    }
    res.json({ transactions: data });
}
