"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_js_1 = require("./auth.controller.js");
const auth_middleware_js_1 = require("./auth.middleware.js");
const validation_middleware_js_1 = require("../../middleware/validation.middleware.js");
const rate_limit_middleware_js_1 = require("../../middleware/rate-limit.middleware.js");
const auth_validation_js_1 = require("./auth.validation.js");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', rate_limit_middleware_js_1.authLimiter, (0, validation_middleware_js_1.validateBody)(auth_validation_js_1.registerSchema), auth_controller_js_1.authController.register.bind(auth_controller_js_1.authController));
router.post('/login', rate_limit_middleware_js_1.authLimiter, (0, validation_middleware_js_1.validateBody)(auth_validation_js_1.loginSchema), auth_controller_js_1.authController.login.bind(auth_controller_js_1.authController));
router.post('/logout', auth_controller_js_1.authController.logout.bind(auth_controller_js_1.authController));
router.post('/verify-email', (0, validation_middleware_js_1.validateBody)(auth_validation_js_1.verifyEmailSchema), auth_controller_js_1.authController.verifyEmail.bind(auth_controller_js_1.authController));
router.post('/resend-otp', rate_limit_middleware_js_1.emailLimiter, (0, validation_middleware_js_1.validateBody)(auth_validation_js_1.resendOtpSchema), auth_controller_js_1.authController.resendVerificationOtp.bind(auth_controller_js_1.authController));
router.post('/forgot-password', rate_limit_middleware_js_1.emailLimiter, (0, validation_middleware_js_1.validateBody)(auth_validation_js_1.forgotPasswordSchema), auth_controller_js_1.authController.forgotPassword.bind(auth_controller_js_1.authController));
router.post('/reset-password', (0, validation_middleware_js_1.validateBody)(auth_validation_js_1.resetPasswordSchema), auth_controller_js_1.authController.resetPassword.bind(auth_controller_js_1.authController));
router.post('/refresh', auth_controller_js_1.authController.refreshToken.bind(auth_controller_js_1.authController));
// Protected routes
router.get('/me', auth_middleware_js_1.authenticate, auth_controller_js_1.authController.me.bind(auth_controller_js_1.authController));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map