"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
const router = express_1.default.Router();
const JWT_SECRET = process.env.MAIN_JWT_SECRET || "dev-jwt-secret-change-me";
const TOKEN_EXP = process.env.MAIN_JWT_EXPIRES_IN || "1h";
const MF_URL = process.env.MF_URL || "http://localhost:3001";
const STOCKS_URL = process.env.STOCKS_URL || "http://localhost:3000";
const INTERNAL_SYNC_SECRET = process.env.INTERNAL_SYNC_SECRET || "dev-internal-sync-secret";
function createGatewayToken(user) {
    return jsonwebtoken_1.default.sign({
        id: user.id,
        userId: user.id,
        email: user.email,
        role: user.role,
        jti: crypto_1.default.randomUUID(),
    }, JWT_SECRET, { subject: user.email, expiresIn: TOKEN_EXP });
}
function toClientUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
}
async function syncStocksUser(user, password) {
    const response = await axios_1.default.post(`${STOCKS_URL}/users/sync`, {
        id: user.id,
        name: user.name,
        email: user.email,
        password,
        role: user.role,
    }, {
        headers: {
            "x-internal-sync-secret": INTERNAL_SYNC_SECRET,
        },
        validateStatus: () => true,
    });
    if (response.status >= 400) {
        throw new Error(response.data?.message || "Failed to sync user to stocks service");
    }
}
async function loginWithMutualFundService(email, password) {
    const response = await axios_1.default.post(`${MF_URL}/api/auth/login`, { email, password }, { validateStatus: () => true });
    if (response.status >= 400 || !response.data?.user) {
        throw Object.assign(new Error(response.data?.message || "Invalid credentials"), {
            status: response.status || 401,
        });
    }
    return response.data.user;
}
router.post("/login", async (req, res) => {
    try {
        const { email, username, password } = req.body || {};
        const loginId = String(email || username || "").trim().toLowerCase();
        if (!loginId || !password) {
            res.status(400).json({ message: "email (or username) and password required" });
            return;
        }
        const user = await loginWithMutualFundService(loginId, String(password));
        const token = createGatewayToken(user);
        res.json({
            token,
            expiresIn: TOKEN_EXP,
            user: toClientUser(user),
        });
    }
    catch (error) {
        res.status(error.status || 502).json({ message: error.message || "Login failed" });
    }
});
router.post("/register", async (req, res) => {
    try {
        const name = String(req.body?.name || "").trim();
        const email = String(req.body?.email || "").trim().toLowerCase();
        const password = String(req.body?.password || "");
        const role = String(req.body?.role || "USER").trim().toUpperCase();
        if (!name || !email || !password) {
            res.status(400).json({ message: "name, email and password are required" });
            return;
        }
        const mfResponse = await axios_1.default.post(`${MF_URL}/api/auth/register`, { name, email, password, role }, { validateStatus: () => true });
        let user = mfResponse.data?.user || null;
        if (mfResponse.status === 409) {
            user = await loginWithMutualFundService(email, password);
        }
        else if (mfResponse.status >= 400 || !user) {
            res.status(mfResponse.status || 502).json({
                message: mfResponse.data?.message || "Failed to register user in mutual fund service",
            });
            return;
        }
        await syncStocksUser(user, password);
        const token = createGatewayToken(user);
        res.status(mfResponse.status === 201 ? 201 : 200).json({
            message: mfResponse.status === 201 ? "User registered" : "User already existed; stocks profile synced",
            token,
            expiresIn: TOKEN_EXP,
            user: toClientUser(user),
        });
    }
    catch (error) {
        res.status(error.status || 502).json({ message: error.message || "Registration failed" });
    }
});
exports.default = router;
