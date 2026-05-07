import type { Request, Response, NextFunction } from 'express';
import type { RegisterInput, LoginInput, VerifyEmailInput, ResendOtpInput, ForgotPasswordInput, ResetPasswordInput } from './auth.validation.js';
export declare class AuthController {
    register(req: Request<unknown, unknown, RegisterInput>, res: Response, next: NextFunction): Promise<void>;
    login(req: Request<unknown, unknown, LoginInput>, res: Response, next: NextFunction): Promise<void>;
    logout(_req: Request, res: Response): Promise<void>;
    verifyEmail(req: Request<unknown, unknown, VerifyEmailInput>, res: Response, next: NextFunction): Promise<void>;
    resendVerificationOtp(req: Request<unknown, unknown, ResendOtpInput>, res: Response, next: NextFunction): Promise<void>;
    forgotPassword(req: Request<unknown, unknown, ForgotPasswordInput>, res: Response, next: NextFunction): Promise<void>;
    resetPassword(req: Request<unknown, unknown, ResetPasswordInput>, res: Response, next: NextFunction): Promise<void>;
    refreshToken(req: Request, res: Response, next: NextFunction): Promise<void>;
    me(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const authController: AuthController;
//# sourceMappingURL=auth.controller.d.ts.map