import type { Request, Response, NextFunction } from 'express';
import { UserModel } from '@instareplyer/database';
import { UnauthorizedError, ForbiddenError } from '../../utils/errors.js';
import { verifyAccessToken } from './utils/token.utils.js';
import type { UserRole } from '@instareplyer/types';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        email: string;
        name: string;
        role: UserRole;
        isVerified: boolean;
        subscription: {
          plan: string;
          status: string;
        };
      };
    }
  }
}

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const payload = verifyAccessToken(token);

    // Get user from database
    const user = await UserModel.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Attach user to request
    req.user = {
      _id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
      subscription: user.subscription,
    };

    next();
  } catch (error) {
    next(error);
  }
}

export function requireVerified(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.user?.isVerified) {
    next(new ForbiddenError('Please verify your email to access this resource'));
    return;
  }
  next();
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new ForbiddenError('You do not have permission to access this resource'));
      return;
    }
    next();
  };
}

export function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  authenticate(req, _res, next);
}
