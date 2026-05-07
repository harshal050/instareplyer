import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { z } from 'zod';
import { instagramController } from './instagram.controller.js';
import { authenticate } from '../auth/auth.middleware.js';
import { validateBody } from '../../middleware/validation.middleware.js';
import { connectInstagramSchema, updateInstagramAccountSchema } from './instagram.validation.js';

const router: ExpressRouter = Router();

router.get('/oauth/callback', instagramController.handleOAuthCallback.bind(instagramController));
router.get('/webhook', instagramController.verifyWebhook.bind(instagramController));
router.post('/webhook', instagramController.handleWebhook.bind(instagramController));

// All routes below require authentication
router.use(authenticate);

router.get('/oauth/url', instagramController.getOAuthUrl.bind(instagramController));

// Connect Instagram account
router.post(
  '/connect',
  validateBody(connectInstagramSchema.partial()),
  instagramController.connectAccount.bind(instagramController)
);

router.post(
  '/process-comment',
  validateBody(
    z.object({
      postId: z.string().min(1),
      commentId: z.string().min(1),
      text: z.string(),
    })
  ),
  instagramController.processComment.bind(instagramController)
);

router.post('/poll-comments', instagramController.pollComments.bind(instagramController));

// Get all connected accounts
router.get('/', instagramController.getAccounts.bind(instagramController));

// Get specific account
router.get('/:accountId', instagramController.getAccount.bind(instagramController));

// Get posts and reels for campaign selection
router.get('/:accountId/media', instagramController.getMedia.bind(instagramController));

// Update account
router.patch(
  '/:accountId',
  validateBody(updateInstagramAccountSchema),
  instagramController.updateAccount.bind(instagramController)
);

// Disconnect account
router.delete('/:accountId', instagramController.disconnectAccount.bind(instagramController));

export default router;
