"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JOB_OPTIONS = exports.QUEUE_NAMES = exports.PAGINATION = exports.PASSWORD_CONFIG = exports.OTP_CONFIG = exports.RATE_LIMITS = exports.COOKIE_OPTIONS = void 0;
exports.COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
};
exports.RATE_LIMITS = {
    // General API rate limit
    api: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // requests per window
    },
    // Auth endpoints (login, register)
    auth: {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 10, // requests per window
    },
    // Email sending (OTP, password reset)
    email: {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 5, // requests per window
    },
};
exports.OTP_CONFIG = {
    length: 6,
    expiresIn: 10 * 60 * 1000, // 10 minutes
};
exports.PASSWORD_CONFIG = {
    minLength: 8,
    saltRounds: 12,
};
exports.PAGINATION = {
    defaultLimit: 20,
    maxLimit: 100,
};
exports.QUEUE_NAMES = {
    sendDm: 'send-dm',
    fetchComments: 'fetch-comments',
    verifyDelivery: 'verify-delivery',
    syncPosts: 'sync-posts',
    sendEmail: 'send-email',
};
exports.JOB_OPTIONS = {
    default: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: 100,
        removeOnFail: 500,
    },
    email: {
        attempts: 5,
        backoff: {
            type: 'fixed',
            delay: 5000,
        },
    },
    dm: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 30000, // Start with 30s to respect Instagram rate limits
        },
    },
};
//# sourceMappingURL=constants.js.map