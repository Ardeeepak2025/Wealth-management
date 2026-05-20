import { createClient, RedisClientType } from "redis";

type RedisLikeClient = {
  isOpen: boolean;
  connect: () => Promise<void>;
  incr: (key: string) => Promise<number>;
  pExpire: (key: string, milliseconds: number) => Promise<void>;
  pTTL: (key: string) => Promise<number>;
};

let redisClient: RedisClientType | null = null;
let connectPromise: Promise<RedisClientType | null> | null = null;
let fallbackClient: RedisLikeClient | null = null;

const fallbackStore = new Map<string, { value: number; expiresAt: number | null }>();

function getRedisUrl() {
  return process.env.REDIS_URL || "";
}

export async function getRedisClient(): Promise<RedisClientType | null> {
  const redisUrl = getRedisUrl();

  if (!redisUrl) {
    return createFallbackClient() as any;
  }

  if (redisClient?.isOpen) {
    return redisClient;
  }

  if (!redisClient) {
    redisClient = createClient({ url: redisUrl });
    redisClient.on("error", (error) => {
      console.warn("Redis client error:", error.message);
    });
  }

  if (!connectPromise) {
    connectPromise = redisClient
      .connect()
      .then(() => redisClient)
      .catch((error) => {
        console.warn("Redis connection failed:", error.message);
        connectPromise = null;
        return null;
      });
  }

  const client = await connectPromise;

  if (!client?.isOpen) {
    return createFallbackClient() as any;
  }

  return client;
}

export async function initializeRedis() {
  return getRedisClient();
}

function createFallbackClient(): RedisLikeClient {
  if (fallbackClient) {
    return fallbackClient;
  }

  const cleanupExpiredKey = (key: string) => {
    const record = fallbackStore.get(key);
    if (!record) {
      return null;
    }

    if (record.expiresAt !== null && record.expiresAt <= Date.now()) {
      fallbackStore.delete(key);
      return null;
    }

    return record;
  };

  fallbackClient = {
    isOpen: true,
    async connect() {
      return;
    },
    async incr(key: string) {
      const record = cleanupExpiredKey(key);
      const nextValue = (record?.value || 0) + 1;
      fallbackStore.set(key, {
        value: nextValue,
        expiresAt: record?.expiresAt ?? null,
      });
      return nextValue;
    },
    async pExpire(key: string, milliseconds: number) {
      const record = fallbackStore.get(key) || { value: 0, expiresAt: null };
      record.expiresAt = Date.now() + milliseconds;
      fallbackStore.set(key, record);
    },
    async pTTL(key: string) {
      const record = cleanupExpiredKey(key);
      if (!record) {
        return -2;
      }

      if (record.expiresAt === null) {
        return -1;
      }

      return Math.max(0, record.expiresAt - Date.now());
    },
  };

  console.warn("Redis URL is not configured or unreachable; using embedded Redis-compatible fallback store.");

  return fallbackClient;
}
