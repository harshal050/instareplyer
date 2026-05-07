import type { Request, Response, NextFunction } from 'express';
import type { UserRole } from '@instareplyer/types';
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
export declare function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void>;
export declare function requireVerified(req: Request, _res: Response, next: NextFunction): void;
export declare function requireRole(...roles: UserRole[]): (req: Request, _res: Response, next: NextFunction) => void;
export declare function optionalAuth(req: Request, _res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.middleware.d.ts.map