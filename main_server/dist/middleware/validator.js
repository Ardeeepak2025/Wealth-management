"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = validateRequest;
/**
 * Request validation middleware factory
 * Validates request body against defined rules
 */
function validateRequest(rules) {
    return (req, res, next) => {
        const body = req.body || {};
        const errors = {};
        for (const rule of rules) {
            const value = body[rule.field];
            // Check required
            if (rule.required && (value === undefined || value === null || value === "")) {
                errors[rule.field] = `${rule.field} is required`;
                continue;
            }
            if (value === undefined || value === null) {
                continue; // skip validation if not required and not provided
            }
            // Check type
            if (rule.type) {
                let typeValid = false;
                switch (rule.type) {
                    case "string":
                        typeValid = typeof value === "string";
                        break;
                    case "number":
                        typeValid = typeof value === "number" && !isNaN(value);
                        break;
                    case "boolean":
                        typeValid = typeof value === "boolean";
                        break;
                    case "email":
                        typeValid = typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                        break;
                    case "array":
                        typeValid = Array.isArray(value);
                        break;
                }
                if (!typeValid) {
                    errors[rule.field] = `${rule.field} must be of type ${rule.type}`;
                    continue;
                }
            }
            // Check string-specific rules
            if (typeof value === "string") {
                if (rule.minLength && value.length < rule.minLength) {
                    errors[rule.field] = `${rule.field} must be at least ${rule.minLength} characters`;
                }
                if (rule.maxLength && value.length > rule.maxLength) {
                    errors[rule.field] = `${rule.field} must be at most ${rule.maxLength} characters`;
                }
                if (rule.pattern && !rule.pattern.test(value)) {
                    errors[rule.field] = `${rule.field} format is invalid`;
                }
            }
            // Check custom validation
            if (rule.custom) {
                const result = rule.custom(value);
                if (result !== true) {
                    errors[rule.field] = typeof result === "string" ? result : `${rule.field} is invalid`;
                }
            }
        }
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: "Validation error",
                errors,
                requestId: req.id,
            });
        }
        next();
    };
}
