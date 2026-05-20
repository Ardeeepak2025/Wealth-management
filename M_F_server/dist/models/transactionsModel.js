"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = getTransactions;
exports.createTransaction = createTransaction;
const db_1 = __importDefault(require("../db"));
async function getTransactions(userId) {
    if (userId) {
        const { data, error } = await db_1.default
            .from("mutual_fund_transactions")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });
        if (error) {
            throw error;
        }
        return (data ?? []);
    }
    const { data, error } = await db_1.default
        .from("mutual_fund_transactions")
        .select("*")
        .order("created_at", { ascending: false });
    if (error) {
        throw error;
    }
    return (data ?? []);
}
async function createTransaction(data) {
    const { data: insertedRows, error } = await db_1.default
        .from("mutual_fund_transactions")
        .insert({
        user_id: data.user_id,
        mutual_fund_id: data.mutual_fund_id,
        transaction_type: data.transaction_type,
        units: data.units,
        nav_price: data.nav_price,
        total_amount: data.total_amount,
    })
        .select("id")
        .single();
    if (error) {
        throw error;
    }
    return insertedRows.id;
}
