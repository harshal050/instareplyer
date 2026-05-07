export declare const COOKIE_OPTIONS: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "lax";
    path: string;
};
export declare const RATE_LIMITS: {
    api: {
        windowMs: number;
        max: number;
    };
    auth: {
        windowMs: number;
        max: number;
    };
    email: {
        windowMs: number;
        max: number;
    };
};
export declare const OTP_CONFIG: {
    length: number;
    expiresIn: number;
};
export declare const PASSWORD_CONFIG: {
    minLength: number;
    saltRounds: number;
};
export declare const PAGINATION: {
    defaultLimit: number;
    maxLimit: number;
};
export declare const QUEUE_NAMES: {
    readonly sendDm: "send-dm";
    readonly fetchComments: "fetch-comments";
    readonly verifyDelivery: "verify-delivery";
    readonly syncPosts: "sync-posts";
    readonly sendEmail: "send-email";
};
export declare const JOB_OPTIONS: {
    default: {
        attempts: number;
        backoff: {
            type: "exponential";
            delay: number;
        };
        removeOnComplete: number;
        removeOnFail: number;
    };
    email: {
        attempts: number;
        backoff: {
            type: "fixed";
            delay: number;
        };
    };
    dm: {
        attempts: number;
        backoff: {
            type: "exponential";
            delay: number;
        };
    };
};
//# sourceMappingURL=constants.d.ts.map