"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsMiddleware = corsMiddleware;
/**
 * CORS middleware with custom configuration
 */
function corsMiddleware(allowedOrigins = ["*"], allowedMethods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"], allowedHeaders = ["Content-Type", "Authorization", "X-Request-ID"]) {
    return (req, res, next) => {
        const origin = req.header("origin") || "*";
        if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
            res.header("Access-Control-Allow-Origin", allowedOrigins.includes("*") ? "*" : origin);
        }
        res.header("Access-Control-Allow-Methods", allowedMethods.join(", "));
        res.header("Access-Control-Allow-Headers", allowedHeaders.join(", "));
        res.header("Access-Control-Max-Age", "3600");
        if (req.method === "OPTIONS") {
            return res.sendStatus(204);
        }
        next();
    };
}
