"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailLimiter = exports.authLimiter = exports.apiLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const constants_js_1 = require("../config/constants.js");
const env_js_1 = require("../config/env.js");
const errors_js_1 = require("../utils/errors.js");
const noRateLimit = (_req, _res, next) => next();
const createLimiter = (options, message) => {
    if (env_js_1.env.isDev)
        return noRateLimit;
    return (0, express_rate_limit_1.default)({
        ...options,
        standardHeaders: true,
        legacyHeaders: false,
        handler: () => {
            throw new errors_js_1.TooManyRequestsError(message);
        },
    });
};
exports.apiLimiter = createLimiter(constants_js_1.RATE_LIMITS.api, 'Too many requests, please try again later');
exports.authLimiter = createLimiter(constants_js_1.RATE_LIMITS.auth, 'Too many authentication attempts, please try again later');
exports.emailLimiter = createLimiter(constants_js_1.RATE_LIMITS.email, 'Too many email requests, please try again later');
//# sourceMappingURL=rate-limit.middleware.js.map