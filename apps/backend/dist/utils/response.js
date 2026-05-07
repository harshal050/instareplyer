"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendCreated = sendCreated;
exports.sendNoContent = sendNoContent;
exports.sendPaginated = sendPaginated;
exports.sendError = sendError;
function sendSuccess(res, data, statusCode = 200, meta) {
    const response = {
        success: true,
        data,
        meta,
    };
    res.status(statusCode).json(response);
}
function sendCreated(res, data) {
    sendSuccess(res, data, 201);
}
function sendNoContent(res) {
    res.status(204).send();
}
function sendPaginated(res, data, page, limit, total) {
    const totalPages = Math.ceil(total / limit);
    sendSuccess(res, data, 200, {
        page,
        limit,
        total,
        totalPages,
    });
}
function sendError(res, message, code, statusCode = 500, details) {
    const response = {
        success: false,
        error: {
            code,
            message,
            details,
        },
    };
    res.status(statusCode).json(response);
}
//# sourceMappingURL=response.js.map