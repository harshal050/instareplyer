"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_js_1 = require("./auth.service.js");
const response_js_1 = require("../../utils/response.js");
const constants_js_1 = require("../../config/constants.js");
class AuthController {
    async register(req, res, next) {
        try {
            const { user, tokens } = await auth_service_js_1.authService.register(req.body);
            // Set refresh token as HTTP-only cookie
            res.cookie('refreshToken', tokens.refreshToken, {
                ...constants_js_1.COOKIE_OPTIONS,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            (0, response_js_1.sendCreated)(res, {
                user,
                accessToken: tokens.accessToken,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const { user, tokens } = await auth_service_js_1.authService.login(req.body);
            // Set refresh token as HTTP-only cookie
            res.cookie('refreshToken', tokens.refreshToken, {
                ...constants_js_1.COOKIE_OPTIONS,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            (0, response_js_1.sendSuccess)(res, {
                user,
                accessToken: tokens.accessToken,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async logout(_req, res) {
        res.clearCookie('refreshToken', constants_js_1.COOKIE_OPTIONS);
        (0, response_js_1.sendNoContent)(res);
    }
    async verifyEmail(req, res, next) {
        try {
            const user = await auth_service_js_1.authService.verifyEmail(req.body);
            (0, response_js_1.sendSuccess)(res, { user });
        }
        catch (error) {
            next(error);
        }
    }
    async resendVerificationOtp(req, res, next) {
        try {
            await auth_service_js_1.authService.resendVerificationOtp(req.body.email);
            (0, response_js_1.sendSuccess)(res, { message: 'If the email exists, a verification code has been sent.' });
        }
        catch (error) {
            next(error);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            await auth_service_js_1.authService.forgotPassword(req.body);
            (0, response_js_1.sendSuccess)(res, { message: 'If the email exists, a password reset link has been sent.' });
        }
        catch (error) {
            next(error);
        }
    }
    async resetPassword(req, res, next) {
        try {
            await auth_service_js_1.authService.resetPassword(req.body);
            (0, response_js_1.sendSuccess)(res, { message: 'Password has been reset successfully.' });
        }
        catch (error) {
            next(error);
        }
    }
    async refreshToken(req, res, next) {
        try {
            const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
            if (!refreshToken) {
                res.status(401).json({ success: false, error: { code: 'NO_TOKEN', message: 'No refresh token provided' } });
                return;
            }
            const tokens = await auth_service_js_1.authService.refreshTokens(refreshToken);
            // Set new refresh token as HTTP-only cookie
            res.cookie('refreshToken', tokens.refreshToken, {
                ...constants_js_1.COOKIE_OPTIONS,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            (0, response_js_1.sendSuccess)(res, { accessToken: tokens.accessToken });
        }
        catch (error) {
            next(error);
        }
    }
    async me(req, res, next) {
        try {
            // User is attached by auth middleware
            (0, response_js_1.sendSuccess)(res, { user: req.user });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map