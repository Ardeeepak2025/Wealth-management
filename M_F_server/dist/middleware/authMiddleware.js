"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireAdmin = requireAdmin;
const authModel_1 = require("../models/authModel");
function requireAuth(req, res, next) {
    const authHeader = req.header("authorization") || req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ message: "Missing auth token" });
        return;
    }
    const token = authHeader.slice(7).trim();
    const payload = (0, authModel_1.verifyToken)(token);
    if (!payload) {
        res.status(401).json({ message: "Invalid or expired token" });
        return;
    }
    req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        jti: payload.jti,
        exp: payload.exp,
    };
    next();
}
function requireAdmin(req, res, next) {
    requireAuth(req, res, () => {
        const user = req.user;
        if (!user || user.role !== "ADMIN") {
            res.status(403).json({ message: "Admin privileges required" });
            return;
        }
        next();
    });
}
