import rateLimit from 'express-rate-limit';
import type { RequestHandler } from 'express';
import { RATE_LIMITS } from '../config/constants.js';
import { env } from '../config/env.js';
import { TooManyRequestsError } from '../utils/errors.js';

const noRateLimit: RequestHandler = (_req, _res, next) => next();
const createLimiter = (options: typeof RATE_LIMITS.api, message: string): RequestHandler => {
  if (env.isDev) return noRateLimit;

  return rateLimit({
    ...options,
    standardHeaders: true,
    legacyHeaders: false,
    handler: () => {
      throw new TooManyRequestsError(message);
    },
  });
};

export const apiLimiter: RequestHandler = createLimiter(
  RATE_LIMITS.api,
  'Too many requests, please try again later'
);

export const authLimiter: RequestHandler = createLimiter(
  RATE_LIMITS.auth,
  'Too many authentication attempts, please try again later'
);

export const emailLimiter: RequestHandler = createLimiter(
  RATE_LIMITS.email,
  'Too many email requests, please try again later'
);
