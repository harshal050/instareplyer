"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_js_1 = require("./user.controller.js");
const auth_middleware_js_1 = require("../auth/auth.middleware.js");
const validation_middleware_js_1 = require("../../middleware/validation.middleware.js");
const zod_1 = require("zod");
const constants_js_1 = require("../../config/constants.js");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_js_1.authenticate);
// Profile routes
router.get('/profile', user_controller_js_1.userController.getProfile.bind(user_controller_js_1.userController));
router.patch('/profile', (0, validation_middleware_js_1.validateBody)(zod_1.z.object({
    name: zod_1.z.string().min(2).max(100).optional(),
    avatar: zod_1.z.string().url().optional(),
})), user_controller_js_1.userController.updateProfile.bind(user_controller_js_1.userController));
// Settings routes
router.patch('/settings', (0, validation_middleware_js_1.validateBody)(zod_1.z.object({
    notifications: zod_1.z.boolean().optional(),
    emailNotifications: zod_1.z.boolean().optional(),
    timezone: zod_1.z.string().optional(),
    language: zod_1.z.string().optional(),
})), user_controller_js_1.userController.updateSettings.bind(user_controller_js_1.userController));
// Password change
router.post('/change-password', (0, validation_middleware_js_1.validateBody)(zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, 'Current password is required'),
    newPassword: zod_1.z
        .string()
        .min(constants_js_1.PASSWORD_CONFIG.minLength, `Password must be at least ${constants_js_1.PASSWORD_CONFIG.minLength} characters`)
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
})), user_controller_js_1.userController.changePassword.bind(user_controller_js_1.userController));
// Delete account
router.delete('/account', user_controller_js_1.userController.deleteAccount.bind(user_controller_js_1.userController));
exports.default = router;
//# sourceMappingURL=user.routes.js.map