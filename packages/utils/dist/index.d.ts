import { type ClassValue } from 'clsx';
export declare function cn(...inputs: ClassValue[]): string;
export declare function formatCurrency(amount: number, currency?: string): string;
export declare function formatNumber(num: number): string;
export declare function formatRelativeTime(date: Date | string): string;
export declare function truncate(str: string, length: number): string;
export declare function generateId(length?: number): string;
export declare function sleep(ms: number): Promise<void>;
export declare function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(func: T, wait: number): (...args: Parameters<T>) => void;
export declare function isValidEmail(email: string): boolean;
export declare function capitalize(str: string): string;
export declare function safeJsonParse<T>(json: string, fallback: T): T;
export declare function getInitials(name: string): string;
export declare const SUBSCRIPTION_LIMITS: {
    readonly free: {
        readonly campaigns: 1;
        readonly instagramAccounts: 1;
        readonly dmsPerMonth: 100;
        readonly teamMembers: 1;
    };
    readonly starter: {
        readonly campaigns: 5;
        readonly instagramAccounts: 2;
        readonly dmsPerMonth: 1000;
        readonly teamMembers: 2;
    };
    readonly pro: {
        readonly campaigns: 20;
        readonly instagramAccounts: 5;
        readonly dmsPerMonth: 10000;
        readonly teamMembers: 5;
    };
    readonly enterprise: {
        readonly campaigns: -1;
        readonly instagramAccounts: -1;
        readonly dmsPerMonth: -1;
        readonly teamMembers: -1;
    };
};
//# sourceMappingURL=index.d.ts.map