"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisClient = getRedisClient;
exports.initializeRedis = initializeRedis;
const redis_1 = require("redis");
let redisClient = null;
let connectPromise = null;
let fallbackClient = null;
const fallbackStore = new Map();
function getRedisUrl() {
    return process.env.REDIS_URL || "";
}
async function getRedisClient() {
    const redisUrl = getRedisUrl();
    if (!redisUrl) {
        return createFallbackClient();
    }
    if (redisClient?.isOpen) {
        return redisClient;
    }
    if (!redisClient) {
        redisClient = (0, redis_1.createClient)({ url: redisUrl });
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
        return createFallbackClient();
    }
    return client;
}
async function initializeRedis() {
    return getRedisClient();
}
function createFallbackClient() {
    if (fallbackClient) {
        return fallbackClient;
    }
    const cleanupExpiredKey = (key) => {
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
        async incr(key) {
            const record = cleanupExpiredKey(key);
            const nextValue = (record?.value || 0) + 1;
            fallbackStore.set(key, {
                value: nextValue,
                expiresAt: record?.expiresAt ?? null,
            });
            return nextValue;
        },
        async pExpire(key, milliseconds) {
            const record = fallbackStore.get(key) || { value: 0, expiresAt: null };
            record.expiresAt = Date.now() + milliseconds;
            fallbackStore.set(key, record);
        },
        async pTTL(key) {
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
