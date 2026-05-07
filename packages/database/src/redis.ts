import Redis from 'ioredis';

let redis: Redis | null = null;

function hasUpstashConfig(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function upstashCommand<T>(command: unknown[]): Promise<T> {
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

  const data = (await response.json()) as { result?: T; error?: string };

  if (!response.ok || data.error) {
    throw new Error(data.error || `Upstash Redis request failed with ${response.status}`);
  }

  return data.result as T;
}

export function getRedisClient(): Redis {
  if (redis) return redis;

  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    throw new Error(
      'REDIS_URL environment variable is not defined. For Upstash REST, use the cache helper functions instead.'
    );
  }

  redis = new Redis(redisUrl, {
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

export async function disconnectRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
    console.log('Redis disconnected');
  }
}

// Cache utilities
export async function setCache(
  key: string,
  value: unknown,
  expirationInSeconds?: number
): Promise<void> {
  const serialized = JSON.stringify(value);

  if (hasUpstashConfig()) {
    if (expirationInSeconds) {
      await upstashCommand(['SETEX', key, expirationInSeconds, serialized]);
    } else {
      await upstashCommand(['SET', key, serialized]);
    }
    return;
  }

  const client = getRedisClient();

  if (expirationInSeconds) {
    await client.setex(key, expirationInSeconds, serialized);
  } else {
    await client.set(key, serialized);
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  if (hasUpstashConfig()) {
    const value = await upstashCommand<string | null>(['GET', key]);

    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  const client = getRedisClient();
  const value = await client.get(key);

  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export async function deleteCache(key: string): Promise<void> {
  if (hasUpstashConfig()) {
    await upstashCommand(['DEL', key]);
    return;
  }

  const client = getRedisClient();
  await client.del(key);
}

export async function clearCachePattern(pattern: string): Promise<void> {
  if (hasUpstashConfig()) {
    const keys = await upstashCommand<string[]>(['KEYS', pattern]);

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
