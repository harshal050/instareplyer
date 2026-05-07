"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("@instareplyer/database");
const constants_js_1 = require("../../config/constants.js");
const errors_js_1 = require("../../utils/errors.js");
const token_utils_js_1 = require("./utils/token.utils.js");
class AuthService {
    async register(data) {
        // Check if user exists
        const existingUser = await database_1.UserModel.findOne({ email: data.email.toLowerCase() });
        if (existingUser) {
            throw new errors_js_1.ConflictError('An account with this email already exists');
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(data.password, constants_js_1.PASSWORD_CONFIG.saltRounds);
        // Generate OTP for email verification
        const otp = (0, token_utils_js_1.generateOTP)(constants_js_1.OTP_CONFIG.length);
        const otpExpiry = new Date(Date.now() + constants_js_1.OTP_CONFIG.expiresIn);
        // Create user
        const user = await database_1.UserModel.create({
            email: data.email.toLowerCase(),
            password: hashedPassword,
            name: data.name,
            verificationOtp: otp,
            verificationOtpExpiry: otpExpiry,
        });
        // TODO: Send verification email with OTP
        // await emailService.sendVerificationEmail(user.email, otp);
        // Generate tokens
        const tokens = this.generateTokens(user);
        // Return user without sensitive fields
        const userResponse = this.sanitizeUser(user);
        return { user: userResponse, tokens };
    }
    async login(data) {
        // Find user with password field
        const user = await database_1.UserModel.findOne({ email: data.email.toLowerCase() }).select('+password');
        if (!user) {
            throw new errors_js_1.UnauthorizedError('Invalid email or password');
        }
        // Verify password
        const isPasswordValid = await bcryptjs_1.default.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new errors_js_1.UnauthorizedError('Invalid email or password');
        }
        // Generate tokens
        const tokens = this.generateTokens(user);
        // Return user without sensitive fields
        const userResponse = this.sanitizeUser(user);
        return { user: userResponse, tokens };
    }
    async verifyEmail(data) {
        const user = await database_1.UserModel.findOne({
            email: data.email.toLowerCase(),
        }).select('+verificationOtp +verificationOtpExpiry');
        if (!user) {
            throw new errors_js_1.NotFoundError('User not found');
        }
        if (user.isVerified) {
            throw new errors_js_1.BadRequestError('Email is already verified');
        }
        if (!user.verificationOtp || !user.verificationOtpExpiry) {
            throw new errors_js_1.BadRequestError('No verification OTP found. Please request a new one.');
        }
        if (new Date() > user.verificationOtpExpiry) {
            throw new errors_js_1.BadRequestError('OTP has expired. Please request a new one.');
        }
        if (user.verificationOtp !== data.otp) {
            throw new errors_js_1.BadRequestError('Invalid OTP');
        }
        // Update user
        user.isVerified = true;
        user.verificationOtp = undefined;
        user.verificationOtpExpiry = undefined;
        await user.save();
        return this.sanitizeUser(user);
    }
    async resendVerificationOtp(email) {
        const user = await database_1.UserModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            // Don't reveal if email exists
            return;
        }
        if (user.isVerified) {
            throw new errors_js_1.BadRequestError('Email is already verified');
        }
        // Generate new OTP
        const otp = (0, token_utils_js_1.generateOTP)(constants_js_1.OTP_CONFIG.length);
        const otpExpiry = new Date(Date.now() + constants_js_1.OTP_CONFIG.expiresIn);
        user.verificationOtp = otp;
        user.verificationOtpExpiry = otpExpiry;
        await user.save();
        // TODO: Send verification email
        // await emailService.sendVerificationEmail(user.email, otp);
    }
    async forgotPassword(data) {
        const user = await database_1.UserModel.findOne({ email: data.email.toLowerCase() });
        if (!user) {
            // Don't reveal if email exists
            return;
        }
        // Generate reset token
        const resetToken = (0, token_utils_js_1.generateResetToken)();
        const hashedToken = (0, token_utils_js_1.hashToken)(resetToken);
        const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        user.resetToken = hashedToken;
        user.resetTokenExpiry = tokenExpiry;
        await user.save();
        // TODO: Send password reset email
        // await emailService.sendPasswordResetEmail(user.email, resetToken);
    }
    async resetPassword(data) {
        const hashedToken = (0, token_utils_js_1.hashToken)(data.token);
        const user = await database_1.UserModel.findOne({
            resetToken: hashedToken,
            resetTokenExpiry: { $gt: new Date() },
        });
        if (!user) {
            throw new errors_js_1.BadRequestError('Invalid or expired reset token');
        }
        // Hash new password
        const hashedPassword = await bcryptjs_1.default.hash(data.password, constants_js_1.PASSWORD_CONFIG.saltRounds);
        // Update user
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();
    }
    async refreshTokens(refreshToken) {
        try {
            const payload = (0, token_utils_js_1.verifyRefreshToken)(refreshToken);
            const user = await database_1.UserModel.findById(payload.userId);
            if (!user) {
                throw new errors_js_1.UnauthorizedError('User not found');
            }
            return this.generateTokens(user);
        }
        catch {
            throw new errors_js_1.UnauthorizedError('Invalid refresh token');
        }
    }
    generateTokens(user) {
        const payload = {
            userId: String(user._id),
            email: user.email,
            role: user.role,
        };
        return {
            accessToken: (0, token_utils_js_1.generateAccessToken)(payload),
            refreshToken: (0, token_utils_js_1.generateRefreshToken)(payload),
        };
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
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map