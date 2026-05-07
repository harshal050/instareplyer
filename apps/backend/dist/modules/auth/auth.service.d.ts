import type { AuthTokens, User } from '@instareplyer/types';
import type { RegisterInput, LoginInput, VerifyEmailInput, ForgotPasswordInput, ResetPasswordInput } from './auth.validation.js';
export declare class AuthService {
    register(data: RegisterInput): Promise<{
        user: User;
        tokens: AuthTokens;
    }>;
    login(data: LoginInput): Promise<{
        user: User;
        tokens: AuthTokens;
    }>;
    verifyEmail(data: VerifyEmailInput): Promise<User>;
    resendVerificationOtp(email: string): Promise<void>;
    forgotPassword(data: ForgotPasswordInput): Promise<void>;
    resetPassword(data: ResetPasswordInput): Promise<void>;
    refreshTokens(refreshToken: string): Promise<AuthTokens>;
    private generateTokens;
    private sanitizeUser;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.service.d.ts.map