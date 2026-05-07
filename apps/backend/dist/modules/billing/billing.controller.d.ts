import type { Request, Response, NextFunction } from 'express';
import type { SubscriptionPlan } from '@instareplyer/types';
export declare class BillingController {
    overview(req: Request, res: Response, next: NextFunction): Promise<void>;
    checkout(req: Request<unknown, unknown, {
        plan: SubscriptionPlan;
    }>, res: Response, next: NextFunction): Promise<void>;
    portal(req: Request, res: Response, next: NextFunction): Promise<void>;
    syncCheckout(req: Request<unknown, unknown, {
        sessionId: string;
    }>, res: Response, next: NextFunction): Promise<void>;
}
export declare const billingController: BillingController;
//# sourceMappingURL=billing.controller.d.ts.map