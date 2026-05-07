export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export const RATE_LIMITS = {
  // General API rate limit
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // requests per window
  },
  // Auth endpoints (login, register)
  auth: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // requests per window
  },
  // Email sending (OTP, password reset)
  email: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // requests per window
  },
};

export const OTP_CONFIG = {
  length: 6,
  expiresIn: 10 * 60 * 1000, // 10 minutes
};

export const PASSWORD_CONFIG = {
  minLength: 8,
  saltRounds: 12,
};

export const PAGINATION = {
  defaultLimit: 20,
  maxLimit: 100,
};

export const QUEUE_NAMES = {
  sendDm: 'send-dm',
  fetchComments: 'fetch-comments',
  verifyDelivery: 'verify-delivery',
  syncPosts: 'sync-posts',
  sendEmail: 'send-email',
} as const;

export const JOB_OPTIONS = {
  default: {
    attempts: 3,
    backoff: {
      type: 'exponential' as const,
      delay: 1000,
    },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
  email: {
    attempts: 5,
    backoff: {
      type: 'fixed' as const,
      delay: 5000,
    },
  },
  dm: {
    attempts: 3,
    backoff: {
      type: 'exponential' as const,
      delay: 30000, // Start with 30s to respect Instagram rate limits
    },
  },
};
