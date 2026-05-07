"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
const node_path_1 = __importDefault(require("node:path"));
dotenv_1.default.config({ path: node_path_1.default.resolve(process.cwd(), '../../.env.local') });
dotenv_1.default.config({ path: node_path_1.default.resolve(process.cwd(), '.env.local'), override: true });
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    // Server
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().transform(Number).default('5000'),
    API_URL: zod_1.z.string().url().default('http://localhost:5000'),
    BACKEND_URL: zod_1.z.string().url().optional(),
    CLIENT_URL: zod_1.z.string().url().default('http://localhost:3000'),
    // Database
    MONGODB_URI: zod_1.z.string().optional(),
    // Redis / Upstash
    REDIS_URL: zod_1.z.string().optional(),
    UPSTASH_REDIS_REST_URL: zod_1.z.string().optional(),
    UPSTASH_REDIS_REST_TOKEN: zod_1.z.string().optional(),
    // JWT
    JWT_ACCESS_SECRET: zod_1.z.string().min(32),
    JWT_REFRESH_SECRET: zod_1.z.string().min(32),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default('7d'),
    // Email
    SMTP_HOST: zod_1.z.string().optional(),
    SMTP_PORT: zod_1.z.string().optional(),
    SMTP_USER: zod_1.z.string().optional(),
    SMTP_PASS: zod_1.z.string().optional(),
    EMAIL_FROM: zod_1.z.string().optional(),
    // Instagram
    INSTAGRAM_CLIENT_ID: zod_1.z.string().optional(),
    INSTAGRAM_CLIENT_SECRET: zod_1.z.string().optional(),
    INSTAGRAM_REDIRECT_URI: zod_1.z.string().optional(),
    // Facebook
    FACEBOOK_APP_ID: zod_1.z.string().optional(),
    FACEBOOK_APP_SECRET: zod_1.z.string().optional(),
    FACEBOOK_PAGE_ID: zod_1.z.string().optional(),
    FACEBOOK_WEBHOOK_VERIFY_TOKEN: zod_1.z.string().optional(),
    INSTAGRAM_WEBHOOK_VERIFY_TOKEN: zod_1.z.string().optional(),
    PAGE_ACCESS_TOKEN: zod_1.z.string().optional(),
    INSTAGRAM_BUSINESS_ID: zod_1.z.string().optional(),
    // Encryption
    ENCRYPTION_KEY: zod_1.z.string().optional(),
    // Stripe
    STRIPE_SECRET_KEY: zod_1.z.string().optional(),
    STRIPE_WEBHOOK_SECRET: zod_1.z.string().optional(),
    STRIPE_PRICE_STARTER: zod_1.z.string().optional(),
    STRIPE_PRICE_PRO: zod_1.z.string().optional(),
    STRIPE_PRICE_ENTERPRISE: zod_1.z.string().optional(),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.warn('Some environment variables are not set');
}
exports.env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    apiUrl: process.env.BACKEND_URL || process.env.API_URL || 'http://localhost:5000',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/instareplyer',
    redis: {
        url: process.env.REDIS_URL || null,
        upstash: {
            enabled: !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
            url: process.env.UPSTASH_REDIS_REST_URL || '',
            token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
        },
    },
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret-32-characters!!',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-32-characters!',
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    smtp: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        from: process.env.EMAIL_FROM || 'noreply@instareplyer.com',
    },
    instagram: {
        clientId: process.env.INSTAGRAM_CLIENT_ID,
        clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
        redirectUri: process.env.INSTAGRAM_REDIRECT_URI,
        businessId: process.env.INSTAGRAM_BUSINESS_ID,
    },
    facebook: {
        appId: process.env.FACEBOOK_APP_ID,
        appSecret: process.env.FACEBOOK_APP_SECRET,
        pageId: process.env.FACEBOOK_PAGE_ID,
        webhookVerifyToken: process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN || process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || '',
        pageAccessToken: process.env.PAGE_ACCESS_TOKEN,
    },
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY || '',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
        prices: {
            starter: process.env.STRIPE_PRICE_STARTER || '',
            pro: process.env.STRIPE_PRICE_PRO || '',
            enterprise: process.env.STRIPE_PRICE_ENTERPRISE || '',
        },
    },
    encryptionKey: process.env.ENCRYPTION_KEY || 'dev-encryption-key-32-chars!!!!',
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
};
//# sourceMappingURL=env.js.map