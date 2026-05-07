import type { Request, Response, NextFunction } from 'express';
import { instagramService } from './instagram.service.js';
import { env } from '../../config/env.js';
import { sendSuccess, sendCreated, sendNoContent } from '../../utils/response.js';
import type { ConnectInstagramInput, UpdateInstagramAccountInput } from './instagram.validation.js';

export class InstagramController {
  async getOAuthUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const url = instagramService.getOAuthUrl(req.user!._id);
      sendSuccess(res, { url });
    } catch (error) {
      next(error);
    }
  }

  async handleOAuthCallback(
    req: Request<unknown, unknown, unknown, { code?: string; state?: string; error_message?: string; error?: string }>,
    res: Response
  ): Promise<void> {
    const redirect = new URL('/dashboard/accounts', process.env.CLIENT_URL || 'http://localhost:3000');

    try {
      if (req.query.error || req.query.error_message) {
        throw new Error(req.query.error_message || req.query.error || 'Instagram authorization was cancelled');
      }
      if (!req.query.code || !req.query.state) {
        throw new Error('Instagram authorization did not return a code');
      }

      await instagramService.connectFromOAuth(req.query.code, req.query.state);
      redirect.searchParams.set('instagram', 'connected');
    } catch (error) {
      redirect.searchParams.set('instagram', 'error');
      redirect.searchParams.set('message', (error as Error).message || 'Failed to connect Instagram account');
    }

    res.redirect(redirect.toString());
  }

  async verifyWebhook(
    req: Request<unknown, unknown, unknown, { 'hub.mode'?: string; 'hub.verify_token'?: string; 'hub.challenge'?: string }>,
    res: Response
  ): Promise<void> {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token && token === env.facebook.webhookVerifyToken && challenge) {
      res.status(200).send(challenge);
      return;
    }

    res.status(403).send('Webhook verification failed');
  }

  async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await instagramService.processWebhookPayload(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async connectAccount(
    req: Request<unknown, unknown, Partial<ConnectInstagramInput>>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const account = req.body.accessToken
        ? await instagramService.connectAccount(req.user!._id, req.body as ConnectInstagramInput)
        : await instagramService.connectConfiguredAccount(req.user!._id);
      sendCreated(res, { account });
    } catch (error) {
      next(error);
    }
  }

  async getMedia(
    req: Request<{ accountId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const posts = await instagramService.getMedia(req.params.accountId, req.user!._id);
      sendSuccess(res, { posts });
    } catch (error) {
      next(error);
    }
  }

  async getAccounts(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const accounts = await instagramService.getAccounts(_req.user!._id);
      sendSuccess(res, { accounts });
    } catch (error) {
      next(error);
    }
  }

  async getAccount(
    req: Request<{ accountId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const account = await instagramService.getAccountById(req.params.accountId, req.user!._id);
      sendSuccess(res, { account });
    } catch (error) {
      next(error);
    }
  }

  async updateAccount(
    req: Request<{ accountId: string }, unknown, UpdateInstagramAccountInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const account = await instagramService.updateAccount(
        req.params.accountId,
        req.user!._id,
        req.body
      );
      sendSuccess(res, { account });
    } catch (error) {
      next(error);
    }
  }

  async disconnectAccount(
    req: Request<{ accountId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await instagramService.disconnectAccount(req.params.accountId, req.user!._id);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }

  async processComment(
    req: Request<unknown, unknown, { postId: string; commentId: string; text: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await instagramService.processComment(req.user!._id, req.body);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async pollComments(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await instagramService.pollActiveCampaignComments();
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export const instagramController = new InstagramController();
