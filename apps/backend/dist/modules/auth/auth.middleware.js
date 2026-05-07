"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.requireVerified = requireVerified;
exports.requireRole = requireRole;
exports.optionalAuth = optionalAuth;
const database_1 = require("@instareplyer/database");
const errors_js_1 = require("../../utils/errors.js");
const token_utils_js_1 = require("./utils/token.utils.js");
async function authenticate(req, _res, next) {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new errors_js_1.UnauthorizedError('No token provided');
        }
        const token = authHeader.split(' ')[1];
        // Verify token
        const payload = (0, token_utils_js_1.verifyAccessToken)(token);
        // Get user from database
        const user = await database_1.UserModel.findById(payload.userId);
        if (!user) {
            throw new errors_js_1.UnauthorizedError('User not found');
        }
        // Attach user to request
        req.user = {
            _id: String(user._id),
            email: user.email,
            name: user.name,
            role: user.role,
            isVerified: user.isVerified,
            subscription: user.subscription,
        };
        next();
    }
    catch (error) {
        next(error);
    }
}
function requireVerified(req, _res, next) {
    if (!req.user?.isVerified) {
        next(new errors_js_1.ForbiddenError('Please verify your email to access this resource'));
        return;
    }
    next();
}
function requireRole(...roles) {
    return (req, _res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            next(new errors_js_1.ForbiddenError('You do not have permission to access this resource'));
            return;
        }
        next();
    };
}
function optionalAuth(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        next();
        return;
    }
    authenticate(req, _res, next);
}
//# sourceMappingURL=auth.middleware.js.map