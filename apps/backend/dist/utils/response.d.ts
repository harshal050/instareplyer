import type { Response } from 'express';
import type { PaginationMeta } from '@instareplyer/types';
export declare function sendSuccess<T>(res: Response, data: T, statusCode?: number, meta?: PaginationMeta): void;
export declare function sendCreated<T>(res: Response, data: T): void;
export declare function sendNoContent(res: Response): void;
export declare function sendPaginated<T>(res: Response, data: T[], page: number, limit: number, total: number): void;
export declare function sendError(res: Response, message: string, code: string, statusCode?: number, details?: Record<string, string[]>): void;
//# sourceMappingURL=response.d.ts.map