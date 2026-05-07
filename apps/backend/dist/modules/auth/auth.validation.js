"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.resendOtpSchema = exports.verifyEmailSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const constants_js_1 = require("../../config/constants.js");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z
        .string()
        .min(constants_js_1.PASSWORD_CONFIG.minLength, `Password must be at least ${constants_js_1.PASSWORD_CONFIG.minLength} characters`)
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.verifyEmailSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    otp: zod_1.z.string().length(6, 'OTP must be 6 digits'),
});
exports.resendOtpSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, 'Reset token is required'),
    password: zod_1.z
        .string()
        .min(constants_js_1.PASSWORD_CONFIG.minLength, `Password must be at least ${constants_js_1.PASSWORD_CONFIG.minLength} characters`)
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1, 'Refresh token is required'),
});
//# sourceMappingURL=auth.validation.js.map