import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { userController } from './user.controller.js';
import { authenticate } from '../auth/auth.middleware.js';
import { validateBody } from '../../middleware/validation.middleware.js';
import { z } from 'zod';
import { PASSWORD_CONFIG } from '../../config/constants.js';

const router: ExpressRouter = Router();

// All routes require authentication
router.use(authenticate);

// Profile routes
router.get('/profile', userController.getProfile.bind(userController));

router.patch(
  '/profile',
  validateBody(
    z.object({
      name: z.string().min(2).max(100).optional(),
      avatar: z.string().url().optional(),
    })
  ),
  userController.updateProfile.bind(userController)
);

// Settings routes
router.patch(
  '/settings',
  validateBody(
    z.object({
      notifications: z.boolean().optional(),
      emailNotifications: z.boolean().optional(),
      timezone: z.string().optional(),
      language: z.string().optional(),
    })
  ),
  userController.updateSettings.bind(userController)
);

// Password change
router.post(
  '/change-password',
  validateBody(
    z.object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z
        .string()
        .min(PASSWORD_CONFIG.minLength, `Password must be at least ${PASSWORD_CONFIG.minLength} characters`)
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    })
  ),
  userController.changePassword.bind(userController)
);

// Delete account
router.delete('/account', userController.deleteAccount.bind(userController));

export default router;
