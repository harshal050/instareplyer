"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
exports.generateOTP = generateOTP;
exports.generateResetToken = generateResetToken;
exports.hashToken = hashToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const env_js_1 = require("../../../config/env.js");
function generateAccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, env_js_1.env.jwt.accessSecret, {
        expiresIn: env_js_1.env.jwt.accessExpiresIn,
    });
}
function generateRefreshToken(payload) {
    return jsonwebtoken_1.default.sign(payload, env_js_1.env.jwt.refreshSecret, {
        expiresIn: env_js_1.env.jwt.refreshExpiresIn,
    });
}
function verifyAccessToken(token) {
    return jsonwebtoken_1.default.verify(token, env_js_1.env.jwt.accessSecret);
}
function verifyRefreshToken(token) {
    return jsonwebtoken_1.default.verify(token, env_js_1.env.jwt.refreshSecret);
}
function generateOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
}
function generateResetToken() {
    return crypto_1.default.randomBytes(32).toString('hex');
}
function hashToken(token) {
    return crypto_1.default.createHash('sha256').update(token).digest('hex');
}
//# sourceMappingURL=token.utils.js.map