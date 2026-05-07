import { z } from 'zod';
export declare const connectInstagramSchema: z.ZodObject<{
    accessToken: z.ZodString;
    instagramUserId: z.ZodString;
    username: z.ZodString;
    profilePicture: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    instagramUserId: string;
    username: string;
    accessToken: string;
    profilePicture?: string | undefined;
}, {
    instagramUserId: string;
    username: string;
    accessToken: string;
    profilePicture?: string | undefined;
}>;
export declare const updateInstagramAccountSchema: z.ZodObject<{
    isActive: z.ZodOptional<z.ZodBoolean>;
    profilePicture: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    profilePicture?: string | undefined;
    isActive?: boolean | undefined;
}, {
    profilePicture?: string | undefined;
    isActive?: boolean | undefined;
}>;
export type ConnectInstagramInput = z.infer<typeof connectInstagramSchema>;
export type UpdateInstagramAccountInput = z.infer<typeof updateInstagramAccountSchema>;
//# sourceMappingURL=instagram.validation.d.ts.map