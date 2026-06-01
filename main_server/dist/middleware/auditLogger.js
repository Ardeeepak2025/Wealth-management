"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogger = auditLogger;
const supabase_1 = require("../supabase");
let warnedAboutConfig = false;
function sanitizeDetails(input) {
    if (!input || typeof input !== "object") {
        return null;
    }
    if (Array.isArray(input)) {
        return { items: [...input] };
    }
    const clone = { ...input };
    const sensitiveKeys = new Set(["password", "token", "authorization", "refreshToken", "accessToken"]);
    for (const key of Object.keys(clone)) {
        if (sensitiveKeys.has(key)) {
            delete clone[key];
        }
    }
    return clone;
}
function getAuditAction(req) {
    const path = req.originalUrl.split("?")[0] || req.path;
    if (path.startsWith("/auth/login"))
        return "auth.login";
    if (path.startsWith("/auth/register"))
        return "auth.register";
    if (path.startsWith("/api/mf") || path.startsWith("/mf"))
        return "proxy.mf";
    if (path.startsWith("/api/stocks") || path.startsWith("/stocks"))
        return "proxy.stocks";
    if (path === "/health")
        return "system.health";
    return `http.${req.method.toLowerCase()}`;
}
function getAuditResource(req) {
    return req.originalUrl.split("?")[0] || req.path;
}
function auditLogger(req, res, next) {
    const startedAt = Date.now();
    res.on("finish", async () => {
        const supabase = (0, supabase_1.getSupabaseClient)();
        if (!supabase) {
            if (!warnedAboutConfig) {
                warnedAboutConfig = true;
                console.warn("Supabase audit logging is disabled. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable it.");
            }
            return;
        }
        const user = req.user || {};
        const requestBody = sanitizeDetails(req.body);
        const details = {
            ...(requestBody ? { requestBody } : {}),
        };
        const payload = {
            request_id: req.id || null,
            action: getAuditAction(req),
            method: req.method,
            path: req.path,
            resource: getAuditResource(req),
            outcome: res.statusCode >= 400 ? "error" : "success",
            status: res.statusCode,
            duration_ms: Date.now() - startedAt,
            ip: req.ip || req.socket.remoteAddress || null,
            actor_id: user.id || null,
            actor_email: user.email || (typeof req.body?.email === "string" ? req.body.email : null),
            actor_role: user.role || null,
            details: Object.keys(details).length > 0 ? details : null,
        };
        try {
            const { error } = await supabase.from("audit_logs").insert(payload);
            if (error) {
                console.warn("Failed to persist audit log:", error.message);
            }
        }
        catch (error) {
            console.warn("Failed to persist audit log:", error?.message || error);
        }
    });
    next();
}
