import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { authController } from './auth.controller.js';
import { authenticate } from './auth.middleware.js';
import { validateBody } from '../../middleware/validation.middleware.js';
import { authLimiter, emailLimiter } from '../../middleware/rate-limit.middleware.js';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.validation.js';

const router: ExpressRouter = Router();

// Public routes
router.post(
  '/register',
  authLimiter,
  validateBody(registerSchema),
  authController.register.bind(authController)
);

router.post(
  '/login',
  authLimiter,
  validateBody(loginSchema),
  authController.login.bind(authController)
);

router.post('/logout', authController.logout.bind(authController));

router.post(
  '/verify-email',
  validateBody(verifyEmailSchema),
  authController.verifyEmail.bind(authController)
);

router.post(
  '/resend-otp',
  emailLimiter,
  validateBody(resendOtpSchema),
  authController.resendVerificationOtp.bind(authController)
);

router.post(
  '/forgot-password',
  emailLimiter,
  validateBody(forgotPasswordSchema),
  authController.forgotPassword.bind(authController)
);

router.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  authController.resetPassword.bind(authController)
);

router.post('/refresh', authController.refreshToken.bind(authController));

// Protected routes
router.get('/me', authenticate, authController.me.bind(authController));

export default router;
