import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors.js';
import { sendError } from '../utils/response.js';
import logger from '../utils/logger.js';
import { env } from '../config/env.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log the error
  logger.error(err.message, { stack: err.stack, path: req.path });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const details: Record<string, string[]> = {};
    err.errors.forEach((error) => {
      const path = error.path.join('.');
      if (!details[path]) {
        details[path] = [];
      }
      details[path].push(error.message);
    });

    sendError(res, 'Validation failed', 'VALIDATION_ERROR', 422, details);
    return;
  }

  // Handle operational errors
  if (err instanceof AppError) {
    sendError(res, err.message, err.code, err.statusCode, err.details);
    return;
  }

  // Handle MongoDB duplicate key error
  if ((err as NodeJS.ErrnoException).code === '11000') {
    sendError(res, 'Duplicate entry', 'CONFLICT', 409);
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid token', 'UNAUTHORIZED', 401);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError(res, 'Token expired', 'TOKEN_EXPIRED', 401);
    return;
  }

  // Default to internal server error
  const message = env.isDev ? err.message : 'Internal server error';
  sendError(res, message, 'INTERNAL_ERROR', 500);
}

export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, `Route ${req.method} ${req.path} not found`, 'NOT_FOUND', 404);
}
