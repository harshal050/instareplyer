export declare const env: {
    readonly nodeEnv: string;
    readonly port: number;
    readonly apiUrl: string;
    readonly clientUrl: string;
    readonly mongodbUri: string;
    readonly redis: {
        readonly url: string | null;
        readonly upstash: {
            readonly enabled: boolean;
            readonly url: string;
            readonly token: string;
        };
    };
    readonly jwt: {
        readonly accessSecret: string;
        readonly refreshSecret: string;
        readonly accessExpiresIn: string;
        readonly refreshExpiresIn: string;
    };
    readonly smtp: {
        readonly host: string | undefined;
        readonly port: number;
        readonly user: string | undefined;
        readonly pass: string | undefined;
        readonly from: string;
    };
    readonly instagram: {
        readonly clientId: string | undefined;
        readonly clientSecret: string | undefined;
        readonly redirectUri: string | undefined;
        readonly businessId: string | undefined;
    };
    readonly facebook: {
        readonly appId: string | undefined;
        readonly appSecret: string | undefined;
        readonly pageId: string | undefined;
        readonly webhookVerifyToken: string;
        readonly pageAccessToken: string | undefined;
    };
    readonly stripe: {
        readonly secretKey: string;
        readonly webhookSecret: string;
        readonly prices: {
            readonly starter: string;
            readonly pro: string;
            readonly enterprise: string;
        };
    };
    readonly encryptionKey: string;
    readonly isDev: boolean;
    readonly isProd: boolean;
};
//# sourceMappingURL=env.d.ts.map