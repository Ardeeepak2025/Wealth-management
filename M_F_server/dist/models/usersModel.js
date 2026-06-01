"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.getUserByEmail = getUserByEmail;
exports.createUser = createUser;
exports.updateUserLastActive = updateUserLastActive;
const db_1 = __importDefault(require("../db"));
async function getUsers() {
    const { data, error } = await db_1.default.from("users").select("*");
    if (error) {
        throw error;
    }
    return (data ?? []);
}
async function getUserById(id) {
    const { data, error } = await db_1.default
        .from("users")
        .select("*")
        .eq("id", id)
        .maybeSingle();
    if (error) {
        throw error;
    }
    return data ?? null;
}
async function getUserByEmail(email) {
    const { data, error } = await db_1.default
        .from("users")
        .select("*")
        .eq("email", email)
        .maybeSingle();
    if (error) {
        throw error;
    }
    return data ?? null;
}
async function createUser(data) {
    const { data: insertedRows, error } = await db_1.default
        .from("users")
        .insert({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
    })
        .select("id")
        .single();
    if (error) {
        throw error;
    }
    return insertedRows.id;
}
async function updateUserLastActive(id) {
    try {
        const { error } = await db_1.default
            .from("users")
            .update({ last_active: new Date().toISOString() })
            .eq("id", id);
        if (error) {
            throw error;
        }
    }
    catch (error) {
        if (typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "42703") {
            return;
        }
        throw error;
    }
}
