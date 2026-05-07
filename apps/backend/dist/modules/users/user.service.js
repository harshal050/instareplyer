"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("@instareplyer/database");
const errors_js_1 = require("../../utils/errors.js");
const constants_js_1 = require("../../config/constants.js");
class UserService {
    async getById(userId) {
        const user = await database_1.UserModel.findById(userId);
        if (!user) {
            throw new errors_js_1.NotFoundError('User not found');
        }
        return this.sanitizeUser(user);
    }
    async updateProfile(userId, data) {
        const user = await database_1.UserModel.findByIdAndUpdate(userId, { $set: data }, { new: true, runValidators: true });
        if (!user) {
            throw new errors_js_1.NotFoundError('User not found');
        }
        return this.sanitizeUser(user);
    }
    async updateSettings(userId, settings) {
        const user = await database_1.UserModel.findById(userId);
        if (!user) {
            throw new errors_js_1.NotFoundError('User not found');
        }
        user.settings = { ...user.settings, ...settings };
        await user.save();
        return this.sanitizeUser(user);
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await database_1.UserModel.findById(userId).select('+password');
        if (!user) {
            throw new errors_js_1.NotFoundError('User not found');
        }
        // Verify current password
        const isPasswordValid = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new errors_js_1.BadRequestError('Current password is incorrect');
        }
        // Hash new password
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, constants_js_1.PASSWORD_CONFIG.saltRounds);
        user.password = hashedPassword;
        await user.save();
    }
    async deleteAccount(userId) {
        const user = await database_1.UserModel.findById(userId);
        if (!user) {
            throw new errors_js_1.NotFoundError('User not found');
        }
        // Soft delete
        user.deletedAt = new Date();
        await user.save();
    }
    sanitizeUser(user) {
        const obj = typeof user.toObject === 'function' ? user.toObject() : user;
        const { password, verificationOtp, verificationOtpExpiry, resetToken, resetTokenExpiry, __v, ...sanitized } = obj;
        return {
            ...sanitized,
            _id: String(sanitized._id),
        };
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
//# sourceMappingURL=user.service.js.map