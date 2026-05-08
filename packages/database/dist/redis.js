"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisClient = getRedisClient;
exports.disconnectRedis = disconnectRedis;
exports.setCache = setCache;
exports.getCache = getCache;
exports.deleteCache = deleteCache;
exports.clearCachePattern = clearCachePattern;
const ioredis_1 = __importDefault(require("ioredis"));
let redis = null;
function hasUpstashConfig() {
    return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}
async function upstashCommand(command) {
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!upstashUrl || !upstashToken) {
        throw new Error('Upstash Redis REST environment variables are not defined');
    }
    const response = await fetch(upstashUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${upstashToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(command),
    });
    const data = (await response.json());
    if (!response.ok || data.error) {
        throw new Error(data.error || `Upstash Redis request failed with ${response.status}`);
    }
    return data.result;
}
function getRedisClient() {
    if (redis)
        return redis;
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
        throw new Error('REDIS_URL environment variable is not defined. For Upstash REST, use the cache helper functions instead.');
    }
    redis = new ioredis_1.default(redisUrl, {
        maxRetriesPerRequest: 3,
        enableOfflineQueue: true,
        lazyConnect: true,
    });
    redis.on('connect', () => {
        console.log('Redis connected successfully');
    });
    redis.on('error', (err) => {
        console.error('Redis connection error:', err);
    });
    redis.on('close', () => {
        console.log('Redis connection closed');
    });
    return redis;
}
async function disconnectRedis() {
    if (redis) {
        await redis.quit();
        redis = null;
        console.log('Redis disconnected');
    }
}
// Cache utilities
async function setCache(key, value, expirationInSeconds) {
    const serialized = JSON.stringify(value);
    if (hasUpstashConfig()) {
        if (expirationInSeconds) {
            await upstashCommand(['SETEX', key, expirationInSeconds, serialized]);
        }
        else {
            await upstashCommand(['SET', key, serialized]);
        }
        return;
    }
    const client = getRedisClient();
    if (expirationInSeconds) {
        await client.setex(key, expirationInSeconds, serialized);
    }
    else {
        await client.set(key, serialized);
    }
}
async function getCache(key) {
    if (hasUpstashConfig()) {
        const value = await upstashCommand(['GET', key]);
        if (!value)
            return null;
        try {
            return JSON.parse(value);
        }
        catch {
            return null;
        }
    }
    const client = getRedisClient();
    const value = await client.get(key);
    if (!value)
        return null;
    try {
        return JSON.parse(value);
    }
    catch {
        return null;
    }
}
async function deleteCache(key) {
    if (hasUpstashConfig()) {
        await upstashCommand(['DEL', key]);
        return;
    }
    const client = getRedisClient();
    await client.del(key);
}
async function clearCachePattern(pattern) {
    if (hasUpstashConfig()) {
        const keys = await upstashCommand(['KEYS', pattern]);
        if (keys.length > 0) {
            await upstashCommand(['DEL', ...keys]);
        }
        return;
    }
    const client = getRedisClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
        await client.del(...keys);
    }
}
//# sourceMappingURL=redis.js.map