"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.logout = logout;
exports.currentUser = currentUser;
exports.register = register;
const usersModel_1 = require("../models/usersModel");
const authModel_1 = require("../models/authModel");
function getAuthToken(req) {
    const authHeader = req.header("authorization") || req.header("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
        return authHeader.slice(7).trim();
    }
    const bodyToken = req.body?.token;
    return typeof bodyToken === "string" && bodyToken.trim() ? bodyToken.trim() : null;
}
function sanitizeUser(user) {
    if (!user) {
        return null;
    }
    const { password, ...safeUser } = user;
    return safeUser;
}
async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "email and password are required" });
        return;
    }
    const user = await (0, usersModel_1.getUserByEmail)(String(email));
    if (!user || user.password !== String(password)) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
    }
    const tokenDetails = (0, authModel_1.createToken)({
        userId: user.id,
        email: user.email,
        role: user.role,
    });
    await (0, usersModel_1.updateUserLastActive)(user.id);
    res.json({
        message: "Login successful",
        token: tokenDetails.token,
        expiresAt: tokenDetails.expiresAt,
        user: sanitizeUser(user),
    });
}
async function logout(req, res) {
    const token = getAuthToken(req);
    if (!token) {
        res.status(400).json({ message: "Missing auth token" });
        return;
    }
    const removed = (0, authModel_1.revokeToken)(token);
    if (!removed) {
        res.status(401).json({ message: "Invalid or expired token" });
        return;
    }
    res.json({ message: "Logout successful" });
}
async function currentUser(req, res) {
    const token = getAuthToken(req);
    if (!token) {
        res.status(401).json({ message: "Missing auth token" });
        return;
    }
    const payload = (0, authModel_1.verifyToken)(token);
    if (!payload) {
        res.status(401).json({ message: "Invalid or expired token" });
        return;
    }
    const user = await (0, usersModel_1.getUserById)(payload.userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json({
        user: sanitizeUser(user),
        token: {
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
            expiresAt: typeof payload.exp === "number"
                ? new Date(payload.exp * 1000).toISOString()
                : null,
        },
    });
}
async function register(req, res) {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
        res.status(400).json({ message: "name, email and password are required" });
        return;
    }
    const existing = await (0, usersModel_1.getUserByEmail)(String(email));
    if (existing) {
        res.status(409).json({ message: "Email already registered" });
        return;
    }
    const id = await (0, usersModel_1.createUser)({ name, email, password, role: role || "USER" });
    const user = await (0, usersModel_1.getUserById)(id);
    if (!user) {
        res.status(500).json({ message: "Failed to create user" });
        return;
    }
    const tokenDetails = (0, authModel_1.createToken)({ userId: user.id, email: user.email, role: user.role });
    await (0, usersModel_1.updateUserLastActive)(user.id).catch(() => { });
    res.status(201).json({ message: "User registered", token: tokenDetails.token, expiresAt: tokenDetails.expiresAt, user: sanitizeUser(user) });
}
