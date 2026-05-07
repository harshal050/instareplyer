"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const user_service_js_1 = require("./user.service.js");
const response_js_1 = require("../../utils/response.js");
class UserController {
    async getProfile(req, res, next) {
        try {
            const user = await user_service_js_1.userService.getById(req.user._id);
            (0, response_js_1.sendSuccess)(res, { user });
        }
        catch (error) {
            next(error);
        }
    }
    async updateProfile(req, res, next) {
        try {
            const { name, avatar } = req.body;
            const user = await user_service_js_1.userService.updateProfile(req.user._id, { name, avatar });
            (0, response_js_1.sendSuccess)(res, { user });
        }
        catch (error) {
            next(error);
        }
    }
    async updateSettings(req, res, next) {
        try {
            const user = await user_service_js_1.userService.updateSettings(req.user._id, req.body);
            (0, response_js_1.sendSuccess)(res, { user });
        }
        catch (error) {
            next(error);
        }
    }
    async changePassword(req, res, next) {
        try {
            const { currentPassword, newPassword } = req.body;
            await user_service_js_1.userService.changePassword(req.user._id, currentPassword, newPassword);
            (0, response_js_1.sendSuccess)(res, { message: 'Password changed successfully' });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteAccount(req, res, next) {
        try {
            await user_service_js_1.userService.deleteAccount(req.user._id);
            res.clearCookie('refreshToken');
            (0, response_js_1.sendNoContent)(res);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
exports.userController = new UserController();
//# sourceMappingURL=user.controller.js.map