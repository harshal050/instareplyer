"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFoundHandler = notFoundHandler;
const zod_1 = require("zod");
const errors_js_1 = require("../utils/errors.js");
const response_js_1 = require("../utils/response.js");
const logger_js_1 = __importDefault(require("../utils/logger.js"));
const env_js_1 = require("../config/env.js");
function errorHandler(err, req, res, _next) {
    // Log the error
    logger_js_1.default.error(err.message, { stack: err.stack, path: req.path });
    // Handle Zod validation errors
    if (err instanceof zod_1.ZodError) {
        const details = {};
        err.errors.forEach((error) => {
            const path = error.path.join('.');
            if (!details[path]) {
                details[path] = [];
            }
            details[path].push(error.message);
        });
        (0, response_js_1.sendError)(res, 'Validation failed', 'VALIDATION_ERROR', 422, details);
        return;
    }
    // Handle operational errors
    if (err instanceof errors_js_1.AppError) {
        (0, response_js_1.sendError)(res, err.message, err.code, err.statusCode, err.details);
        return;
    }
    // Handle MongoDB duplicate key error
    if (err.code === '11000') {
        (0, response_js_1.sendError)(res, 'Duplicate entry', 'CONFLICT', 409);
        return;
    }
    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        (0, response_js_1.sendError)(res, 'Invalid token', 'UNAUTHORIZED', 401);
        return;
    }
    if (err.name === 'TokenExpiredError') {
        (0, response_js_1.sendError)(res, 'Token expired', 'TOKEN_EXPIRED', 401);
        return;
    }
    // Default to internal server error
    const message = env_js_1.env.isDev ? err.message : 'Internal server error';
    (0, response_js_1.sendError)(res, message, 'INTERNAL_ERROR', 500);
}
function notFoundHandler(req, res) {
    (0, response_js_1.sendError)(res, `Route ${req.method} ${req.path} not found`, 'NOT_FOUND', 404);
}
//# sourceMappingURL=error.middleware.js.map