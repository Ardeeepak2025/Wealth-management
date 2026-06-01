"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRateLimiter = createRateLimiter;
/**
 * Simple rate limiting middleware
 * Limits requests per IP address
 */
function createRateLimiter(windowMs = 60000, // 1 minute
maxRequests = 100) {
    const store = {};
    return (req, res, next) => {
        const ip = req.ip || "unknown";
        const now = Date.now();
        if (!store[ip]) {
            store[ip] = { count: 0, resetTime: now + windowMs };
        }
        const record = store[ip];
        // Reset if window has expired
        if (now > record.resetTime) {
            record.count = 0;
            record.resetTime = now + windowMs;
        }
        record.count++;
        res.setHeader("X-RateLimit-Limit", maxRequests);
        res.setHeader("X-RateLimit-Remaining", Math.max(0, maxRequests - record.count));
        res.setHeader("X-RateLimit-Reset", Math.ceil(record.resetTime / 1000));
        if (record.count > maxRequests) {
            return res.status(429).json({
                message: "Too many requests, please try again later",
                retryAfter: Math.ceil((record.resetTime - now) / 1000),
            });
        }
        next();
    };
}
