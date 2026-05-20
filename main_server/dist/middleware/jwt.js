"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtMiddleware = jwtMiddleware;
exports.requireRole = requireRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.MAIN_JWT_SECRET || "dev-jwt-secret-change-me";
function jwtMiddleware(req, res, next) {
    try {
        const auth = req.header("authorization") || "";
        if (!auth.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Missing Bearer token" });
        }
        const token = auth.slice(7).trim();
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.token = token;
        req.user = {
            id: String(payload.id || payload.sub || "unknown"),
            role: String(payload.role || "user"),
            email: payload.email ? String(payload.email) : undefined,
        };
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token", error: err?.message });
    }
}
function requireRole(role) {
    return (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ message: "Not authenticated" });
        if (req.user.role !== role)
            return res.status(403).json({ message: "Forbidden" });
        next();
    };
}
