import type { JWTPayload, UserRole } from '@instareplyer/types';
interface TokenPayload {
    userId: string;
    email: string;
    role: UserRole;
}
export declare function generateAccessToken(payload: TokenPayload): string;
export declare function generateRefreshToken(payload: TokenPayload): string;
export declare function verifyAccessToken(token: string): JWTPayload;
export declare function verifyRefreshToken(token: string): JWTPayload;
export declare function generateOTP(length?: number): string;
export declare function generateResetToken(): string;
export declare function hashToken(token: string): string;
export {};
//# sourceMappingURL=token.utils.d.ts.map