export declare class AppError extends Error {
    readonly statusCode: number;
    readonly code: string;
    readonly isOperational: boolean;
    readonly details?: Record<string, string[]>;
    constructor(message: string, statusCode?: number, code?: string, details?: Record<string, string[]>);
}
export declare class BadRequestError extends AppError {
    constructor(message: string, details?: Record<string, string[]>);
}
export declare class UnauthorizedError extends AppError {
    constructor(message?: string);
}
export declare class ForbiddenError extends AppError {
    constructor(message?: string);
}
export declare class NotFoundError extends AppError {
    constructor(message?: string);
}
export declare class ConflictError extends AppError {
    constructor(message: string);
}
export declare class ValidationError extends AppError {
    constructor(details: Record<string, string[]>);
}
export declare class TooManyRequestsError extends AppError {
    constructor(message?: string);
}
export declare class InternalError extends AppError {
    constructor(message?: string);
}
//# sourceMappingURL=errors.d.ts.map