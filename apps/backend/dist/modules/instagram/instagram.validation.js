"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInstagramAccountSchema = exports.connectInstagramSchema = void 0;
const zod_1 = require("zod");
exports.connectInstagramSchema = zod_1.z.object({
    accessToken: zod_1.z.string().min(1, 'Access token is required'),
    instagramUserId: zod_1.z.string().min(1, 'Instagram user ID is required'),
    username: zod_1.z.string().min(1, 'Username is required'),
    profilePicture: zod_1.z.string().url().optional(),
});
exports.updateInstagramAccountSchema = zod_1.z.object({
    isActive: zod_1.z.boolean().optional(),
    profilePicture: zod_1.z.string().url().optional(),
});
//# sourceMappingURL=instagram.validation.js.map