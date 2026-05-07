import type { User } from '@instareplyer/types';
export declare class UserService {
    getById(userId: string): Promise<User>;
    updateProfile(userId: string, data: {
        name?: string;
        avatar?: string;
    }): Promise<User>;
    updateSettings(userId: string, settings: Partial<User['settings']>): Promise<User>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    deleteAccount(userId: string): Promise<void>;
    private sanitizeUser;
}
export declare const userService: UserService;
//# sourceMappingURL=user.service.d.ts.map