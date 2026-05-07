import type { Request, Response, NextFunction } from 'express';
import { campaignService } from './campaign.service.js';
import { sendSuccess, sendCreated, sendNoContent } from '../../utils/response.js';
import type { CreateCampaignInput, UpdateCampaignInput } from './campaign.validation.js';

export class CampaignController {
  async createCampaign(
    req: Request<unknown, unknown, CreateCampaignInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const campaign = await campaignService.createCampaign(req.user!._id, req.body);
      sendCreated(res, { campaign });
    } catch (error) {
      next(error);
    }
  }

  async getCampaigns(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const campaigns = await campaignService.getCampaigns(_req.user!._id);
      sendSuccess(res, { campaigns });
    } catch (error) {
      next(error);
    }
  }

  async getCampaign(
    req: Request<{ campaignId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const campaign = await campaignService.getCampaignById(req.params.campaignId, req.user!._id);
      sendSuccess(res, { campaign });
    } catch (error) {
      next(error);
    }
  }

  async updateCampaign(
    req: Request<{ campaignId: string }, unknown, UpdateCampaignInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const campaign = await campaignService.updateCampaign(
        req.params.campaignId,
        req.user!._id,
        req.body
      );
      sendSuccess(res, { campaign });
    } catch (error) {
      next(error);
    }
  }

  async deleteCampaign(
    req: Request<{ campaignId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await campaignService.deleteCampaign(req.params.campaignId, req.user!._id);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }

  async startCampaign(
    req: Request<{ campaignId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const campaign = await campaignService.startCampaign(req.params.campaignId, req.user!._id);
      sendSuccess(res, { campaign });
    } catch (error) {
      next(error);
    }
  }

  async pauseCampaign(
    req: Request<{ campaignId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const campaign = await campaignService.pauseCampaign(req.params.campaignId, req.user!._id);
      sendSuccess(res, { campaign });
    } catch (error) {
      next(error);
    }
  }
}

export const campaignController = new CampaignController();
