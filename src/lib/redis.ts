import { Redis } from "@upstash/redis";

let cached: Redis | null = null;
let cachedKey = "";

function readRedisEnv(): { url: string; token: string } | null {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) return null;
    return { url, token };
}

function getRedis() {
    const cfg = readRedisEnv();
    if (!cfg) return null;
    const key = `${cfg.url}|${cfg.token.slice(0, 8)}`;
    if (cached && cachedKey === key) return cached;
    cached = new Redis({ url: cfg.url, token: cfg.token });
    cachedKey = key;
    return cached;
}

export function redisEnabled(): boolean {
    return readRedisEnv() !== null;
}

export const roomChannel = (roomId: string) => `drawy:room:${roomId}`;
export const presenceKey = (roomId: string) => `drawy:presence:${roomId}`;

export async function redisPublish(roomId: string, payload: unknown): Promise<boolean> {
    const r = getRedis();
    if (!r) return false;
    try {
        await r.publish(roomChannel(roomId), JSON.stringify(payload));
        return true;
    } catch {
        return false;
    }
}

export async function redisSetPresence(
    roomId: string,
    connId: string,
    presence: Record<string, unknown>,
    ttlSeconds = 120,
) {
    const r = getRedis();
    if (!r) return false;
    try {
        await r.hset(presenceKey(roomId), {
            [connId]: JSON.stringify({ ...presence, _at: Date.now() }),
        });
        await r.expire(presenceKey(roomId), ttlSeconds);
        return true;
    } catch {
        return false;
    }
}

export async function redisRemovePresence(roomId: string, connId: string) {
    const r = getRedis();
    if (!r) return false;
    try {
        await r.hdel(presenceKey(roomId), connId);
        return true;
    } catch {
        return false;
    }
}