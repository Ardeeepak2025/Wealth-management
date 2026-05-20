"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
/**
 * Request logging middleware
 * Logs all incoming requests and their responses
 */
function requestLogger(req, res, next) {
    const startTime = Date.now();
    const requestId = req.id || "N/A";
    const originalSend = res.send;
    res.send = function (data) {
        const duration = Date.now() - startTime;
        console.log(`[${new Date().toISOString()}] [${requestId}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
        return originalSend.call(this, data);
    };
    next();
}
