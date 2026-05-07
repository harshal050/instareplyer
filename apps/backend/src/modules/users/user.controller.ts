import type { Request, Response, NextFunction } from 'express';
import { userService } from './user.service.js';
import { sendSuccess, sendNoContent } from '../../utils/response.js';

export class UserController {
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.getById(req.user!._id);
      sendSuccess(res, { user });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, avatar } = req.body;
      const user = await userService.updateProfile(req.user!._id, { name, avatar });
      sendSuccess(res, { user });
    } catch (error) {
      next(error);
    }
  }

  async updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.updateSettings(req.user!._id, req.body);
      sendSuccess(res, { user });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;
      await userService.changePassword(req.user!._id, currentPassword, newPassword);
      sendSuccess(res, { message: 'Password changed successfully' });
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.deleteAccount(req.user!._id);
      res.clearCookie('refreshToken');
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
