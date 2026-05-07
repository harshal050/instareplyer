import type { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

type ValidationTarget = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const data = target === 'body' ? req.body : target === 'query' ? req.query : req.params;
      const validated = schema.parse(data);
      
      if (target === 'body') {
        req.body = validated;
      } else if (target === 'query') {
        req.query = validated;
      } else {
        req.params = validated as Record<string, string>;
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function validateBody(schema: ZodSchema) {
  return validate(schema, 'body');
}

export function validateQuery(schema: ZodSchema) {
  return validate(schema, 'query');
}

export function validateParams(schema: ZodSchema) {
  return validate(schema, 'params');
}
