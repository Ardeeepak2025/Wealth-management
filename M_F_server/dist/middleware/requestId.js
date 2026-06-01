"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestIdMiddleware = requestIdMiddleware;
const crypto_1 = require("crypto");
/**
 * Request ID tracking middleware
 * Adds a unique ID to each request for tracing
 */
function requestIdMiddleware(req, res, next) {
    const requestId = req.header("x-request-id") || (0, crypto_1.randomUUID)();
    req.id = requestId;
    res.setHeader("x-request-id", requestId);
    next();
}
