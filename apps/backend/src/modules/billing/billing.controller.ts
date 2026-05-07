import type { Request, Response, NextFunction } from 'express';
import type { SubscriptionPlan } from '@instareplyer/types';
import { billingService } from './billing.service.js';
import { sendSuccess } from '../../utils/response.js';

export class BillingController {
  async overview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const billing = await billingService.getOverview(req.user!._id);
      sendSuccess(res, { billing });
    } catch (error) {
      next(error);
    }
  }

  async checkout(
    req: Request<unknown, unknown, { plan: SubscriptionPlan }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const session = await billingService.createCheckoutSession(req.user!._id, req.body.plan);
      sendSuccess(res, session);
    } catch (error) {
      next(error);
    }
  }

  async portal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await billingService.createPortalSession(req.user!._id);
      sendSuccess(res, session);
    } catch (error) {
      next(error);
    }
  }

  async syncCheckout(
    req: Request<unknown, unknown, { sessionId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await billingService.syncCheckoutSession(req.body.sessionId);
      sendSuccess(res, { synced: true });
    } catch (error) {
      next(error);
    }
  }
}

export const billingController = new BillingController();
