import type { Response } from 'express';
import type { ApiResponse, PaginationMeta } from '@instareplyer/types';

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  meta?: PaginationMeta
): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
    meta,
  };

  res.status(statusCode).json(response);
}

export function sendCreated<T>(res: Response, data: T): void {
  sendSuccess(res, data, 201);
}

export function sendNoContent(res: Response): void {
  res.status(204).send();
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number
): void {
  const totalPages = Math.ceil(total / limit);
  
  sendSuccess(res, data, 200, {
    page,
    limit,
    total,
    totalPages,
  });
}

export function sendError(
  res: Response,
  message: string,
  code: string,
  statusCode: number = 500,
  details?: Record<string, string[]>
): void {
  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };

  res.status(statusCode).json(response);
}
