"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = createToken;
exports.verifyToken = verifyToken;
exports.revokeToken = revokeToken;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const revokedTokens = new Map();
const jwtSecret = process.env.JWT_SECRET || "dev-jwt-secret-change-me";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1d";
function cleanupRevokedTokens() {
    const now = Date.now();
    for (const [jti, expiresAt] of revokedTokens.entries()) {
        if (expiresAt <= now) {
            revokedTokens.delete(jti);
        }
    }
}
function createToken(data) {
    cleanupRevokedTokens();
    const jti = crypto_1.default.randomUUID();
    const token = jsonwebtoken_1.default.sign({
        userId: data.userId,
        email: data.email,
        role: data.role,
        jti,
    }, jwtSecret, { expiresIn: jwtExpiresIn });
    const decoded = jsonwebtoken_1.default.decode(token);
    if (!decoded || typeof decoded.exp !== "number") {
        throw new Error("Failed to create auth token");
    }
    return {
        token,
        expiresAt: new Date(decoded.exp * 1000).toISOString(),
        payload: decoded,
    };
}
function verifyToken(token) {
    cleanupRevokedTokens();
    try {
        const payload = jsonwebtoken_1.default.verify(token, jwtSecret);
        if (revokedTokens.has(payload.jti)) {
            return null;
        }
        return payload;
    }
    catch {
        return null;
    }
}
function revokeToken(token) {
    const decoded = jsonwebtoken_1.default.decode(token);
    if (!decoded?.jti || !decoded.exp) {
        return false;
    }
    revokedTokens.set(decoded.jti, decoded.exp * 1000);
    return true;
}
