import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { z } from 'zod';
import { authenticate } from '../auth/auth.middleware.js';
import { validateBody } from '../../middleware/validation.middleware.js';
import { billingController } from './billing.controller.js';

const router: ExpressRouter = Router();

router.use(authenticate);

router.get('/', billingController.overview.bind(billingController));
router.post(
  '/checkout',
  validateBody(z.object({ plan: z.enum(['starter', 'pro', 'enterprise']) })),
  billingController.checkout.bind(billingController)
);
router.post('/portal', billingController.portal.bind(billingController));
router.post(
  '/sync-checkout',
  validateBody(z.object({ sessionId: z.string().min(1) })),
  billingController.syncCheckout.bind(billingController)
);

export default router;
