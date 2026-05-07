"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalError = exports.TooManyRequestsError = exports.ValidationError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    code;
    isOperational;
    details;
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class BadRequestError extends AppError {
    constructor(message, details) {
        super(message, 400, 'BAD_REQUEST', details);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401, 'UNAUTHORIZED');
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403, 'FORBIDDEN');
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404, 'NOT_FOUND');
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends AppError {
    constructor(message) {
        super(message, 409, 'CONFLICT');
    }
}
exports.ConflictError = ConflictError;
class ValidationError extends AppError {
    constructor(details) {
        super('Validation failed', 422, 'VALIDATION_ERROR', details);
    }
}
exports.ValidationError = ValidationError;
class TooManyRequestsError extends AppError {
    constructor(message = 'Too many requests') {
        super(message, 429, 'TOO_MANY_REQUESTS');
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
class InternalError extends AppError {
    constructor(message = 'Internal server error') {
        super(message, 500, 'INTERNAL_ERROR');
    }
}
exports.InternalError = InternalError;
//# sourceMappingURL=errors.js.map