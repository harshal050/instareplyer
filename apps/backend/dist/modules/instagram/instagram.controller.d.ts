import type { Request, Response, NextFunction } from 'express';
import type { ConnectInstagramInput, UpdateInstagramAccountInput } from './instagram.validation.js';
export declare class InstagramController {
    getOAuthUrl(req: Request, res: Response, next: NextFunction): Promise<void>;
    handleOAuthCallback(req: Request<unknown, unknown, unknown, {
        code?: string;
        state?: string;
        error_message?: string;
        error?: string;
    }>, res: Response): Promise<void>;
    verifyWebhook(req: Request<unknown, unknown, unknown, {
        'hub.mode'?: string;
        'hub.verify_token'?: string;
        'hub.challenge'?: string;
    }>, res: Response): Promise<void>;
    handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void>;
    connectAccount(req: Request<unknown, unknown, Partial<ConnectInstagramInput>>, res: Response, next: NextFunction): Promise<void>;
    getMedia(req: Request<{
        accountId: string;
    }>, res: Response, next: NextFunction): Promise<void>;
    getAccounts(_req: Request, res: Response, next: NextFunction): Promise<void>;
    getAccount(req: Request<{
        accountId: string;
    }>, res: Response, next: NextFunction): Promise<void>;
    updateAccount(req: Request<{
        accountId: string;
    }, unknown, UpdateInstagramAccountInput>, res: Response, next: NextFunction): Promise<void>;
    disconnectAccount(req: Request<{
        accountId: string;
    }>, res: Response, next: NextFunction): Promise<void>;
    processComment(req: Request<unknown, unknown, {
        postId: string;
        commentId: string;
        text: string;
    }>, res: Response, next: NextFunction): Promise<void>;
    pollComments(_req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const instagramController: InstagramController;
//# sourceMappingURL=instagram.controller.d.ts.map