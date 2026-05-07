import { z } from 'zod';

export const connectInstagramSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  instagramUserId: z.string().min(1, 'Instagram user ID is required'),
  username: z.string().min(1, 'Username is required'),
  profilePicture: z.string().url().optional(),
});

export const updateInstagramAccountSchema = z.object({
  isActive: z.boolean().optional(),
  profilePicture: z.string().url().optional(),
});

export type ConnectInstagramInput = z.infer<typeof connectInstagramSchema>;
export type UpdateInstagramAccountInput = z.infer<typeof updateInstagramAccountSchema>;
