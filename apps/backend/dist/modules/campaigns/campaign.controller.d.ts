import type { Request, Response, NextFunction } from 'express';
import type { CreateCampaignInput, UpdateCampaignInput } from './campaign.validation.js';
export declare class CampaignController {
    createCampaign(req: Request<unknown, unknown, CreateCampaignInput>, res: Response, next: NextFunction): Promise<void>;
    getCampaigns(_req: Request, res: Response, next: NextFunction): Promise<void>;
    getCampaign(req: Request<{
        campaignId: string;
    }>, res: Response, next: NextFunction): Promise<void>;
    updateCampaign(req: Request<{
        campaignId: string;
    }, unknown, UpdateCampaignInput>, res: Response, next: NextFunction): Promise<void>;
    deleteCampaign(req: Request<{
        campaignId: string;
    }>, res: Response, next: NextFunction): Promise<void>;
    startCampaign(req: Request<{
        campaignId: string;
    }>, res: Response, next: NextFunction): Promise<void>;
    pauseCampaign(req: Request<{
        campaignId: string;
    }>, res: Response, next: NextFunction): Promise<void>;
}
export declare const campaignController: CampaignController;
//# sourceMappingURL=campaign.controller.d.ts.map