import type { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';
import { sendSuccess, sendCreated, sendNoContent } from '../../utils/response.js';
import { COOKIE_OPTIONS } from '../../config/constants.js';
import { env } from '../../config/env.js';
import type {
  RegisterInput,
  LoginInput,
  VerifyEmailInput,
  ResendOtpInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from './auth.validation.js';

export class AuthController {
  async register(
    req: Request<unknown, unknown, RegisterInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { user, tokens } = await authService.register(req.body);

      // Set refresh token as HTTP-only cookie
      res.cookie('refreshToken', tokens.refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      sendCreated(res, {
        user,
        accessToken: tokens.accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(
    req: Request<unknown, unknown, LoginInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { user, tokens } = await authService.login(req.body);

      // Set refresh token as HTTP-only cookie
      res.cookie('refreshToken', tokens.refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      sendSuccess(res, {
        user,
        accessToken: tokens.accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    sendNoContent(res);
  }

  async verifyEmail(
    req: Request<unknown, unknown, VerifyEmailInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await authService.verifyEmail(req.body);
      sendSuccess(res, { user });
    } catch (error) {
      next(error);
    }
  }

  async resendVerificationOtp(
    req: Request<unknown, unknown, ResendOtpInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await authService.resendVerificationOtp(req.body.email);
      sendSuccess(res, { message: 'If the email exists, a verification code has been sent.' });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(
    req: Request<unknown, unknown, ForgotPasswordInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await authService.forgotPassword(req.body);
      sendSuccess(res, { message: 'If the email exists, a password reset link has been sent.' });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(
    req: Request<unknown, unknown, ResetPasswordInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await authService.resetPassword(req.body);
      sendSuccess(res, { message: 'Password has been reset successfully.' });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        res.status(401).json({ success: false, error: { code: 'NO_TOKEN', message: 'No refresh token provided' } });
        return;
      }

      const tokens = await authService.refreshTokens(refreshToken);

      // Set new refresh token as HTTP-only cookie
      res.cookie('refreshToken', tokens.refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      sendSuccess(res, { accessToken: tokens.accessToken });
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // User is attached by auth middleware
      sendSuccess(res, { user: req.user });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
