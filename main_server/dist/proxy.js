"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProxyHandler = createProxyHandler;
const axios_1 = __importDefault(require("axios"));
function copyHeaders(original) {
    const headers = {};
    for (const [k, v] of Object.entries(original || {})) {
        if (v == null)
            continue;
        headers[k] = String(v);
    }
    // remove host to avoid downstream confusion
    delete headers["host"];
    return headers;
}
function normalizePrefix(prefix) {
    if (!prefix)
        return "";
    return prefix.startsWith("/") ? prefix : `/${prefix}`;
}
function joinTargetPath(path, targetPathPrefix) {
    const normalizedPath = path || "";
    const prefix = normalizePrefix(targetPathPrefix);
    if (!prefix) {
        return normalizedPath;
    }
    if (normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`)) {
        return normalizedPath;
    }
    if (!normalizedPath || normalizedPath === "/") {
        return prefix;
    }
    return `${prefix}${normalizedPath}`;
}
function createProxyHandler(targetBase, targetPathPrefix = "") {
    return async (req, res, _next) => {
        try {
            const path = req.path || ""; // path after mount
            const qs = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
            const targetUrl = `${targetBase}${joinTargetPath(path, targetPathPrefix)}${qs}`;
            const config = {
                url: targetUrl,
                method: req.method,
                headers: copyHeaders(req.headers),
                data: req.rawBody || req.body || undefined,
                validateStatus: () => true,
                // forward timeout etc if needed
            };
            // Forward authenticated user info and the validated JWT to downstream services.
            if (req.user) {
                config.headers = config.headers || {};
                config.headers["x-user-id"] = String(req.user.id);
                config.headers["x-user-role"] = String(req.user.role);
                if (req.token) {
                    config.headers["authorization"] = `Bearer ${req.token}`;
                }
            }
            const response = await axios_1.default.request(config);
            // copy status, headers and body
            for (const [k, v] of Object.entries(response.headers || {})) {
                // some headers should not be forwarded
                if (k.toLowerCase() === "transfer-encoding")
                    continue;
                res.setHeader(k, String(v));
            }
            res.status(response.status).send(response.data);
        }
        catch (err) {
            console.error("Proxy error:", err?.message || err);
            res.status(502).json({ message: "Bad gateway", error: err?.message });
        }
    };
}
