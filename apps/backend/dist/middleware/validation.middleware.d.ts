import type { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
type ValidationTarget = 'body' | 'query' | 'params';
export declare function validate(schema: ZodSchema, target?: ValidationTarget): (req: Request, _res: Response, next: NextFunction) => void;
export declare function validateBody(schema: ZodSchema): (req: Request, _res: Response, next: NextFunction) => void;
export declare function validateQuery(schema: ZodSchema): (req: Request, _res: Response, next: NextFunction) => void;
export declare function validateParams(schema: ZodSchema): (req: Request, _res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=validation.middleware.d.ts.map