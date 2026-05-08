import Redis from 'ioredis';
export declare function getRedisClient(): Redis;
export declare function disconnectRedis(): Promise<void>;
export declare function setCache(key: string, value: unknown, expirationInSeconds?: number): Promise<void>;
export declare function getCache<T>(key: string): Promise<T | null>;
export declare function deleteCache(key: string): Promise<void>;
export declare function clearCachePattern(pattern: string): Promise<void>;
//# sourceMappingURL=redis.d.ts.map