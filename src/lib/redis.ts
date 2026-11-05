import { Redis } from "@upstash/redis";

type RedisEnv = {
  UPSTASH_REDIS_REST_URL?: string;
  UPSTASH_REDIS_REST_TOKEN?: string;
  UPSTASH_REDIS_URL?: string;
};

function readRedisEnv(env: RedisEnv = process.env as unknown as RedisEnv) {
  const url = env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

let cached: Redis | null = null;
let cachedKey = "";

function getRedis(env?: RedisEnv): Redis | null {
  const cfg = readRedisEnv(env ?? (process.env as unknown as RedisEnv));
  if (!cfg) return null;
  const key = `${cfg.url}|${cfg.token.slice(0, 8)}`;
  if (cached && cachedKey === key) return cached;
  cached = new Redis({ url: cfg.url, token: cfg.token });
  cachedKey = key;
  return cached;
}

export function redisEnabled(env?: RedisEnv): boolean {
  return Boolean(readRedisEnv(env ?? (process.env as unknown as RedisEnv)));
}

export const roomChannel = (roomId: string) => `drawy:room:${roomId}`;
export const presenceKey = (roomId: string) => `drawy:presence:${roomId}`;

export async function redisPublish(
  roomId: string,
  payload: unknown,
  env?: RedisEnv,
): Promise<boolean> {
  const r = getRedis(env);
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
  env?: RedisEnv,
) {
  const r = getRedis(env);
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

export async function redisRemovePresence(roomId: string, connId: string, env?: RedisEnv) {
  const r = getRedis(env);
  if (!r) return false;
  try {
    await r.hdel(presenceKey(roomId), connId);
    return true;
  } catch {
    return false;
  }
}

export async function redisGetPresence(
  roomId: string,
  env?: RedisEnv,
): Promise<Record<string, unknown>> {
  const r = getRedis(env);
  if (!r) return {};
  try {
    const h = await r.hgetall<Record<string, string>>(presenceKey(roomId));
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(h ?? {})) {
      try {
        out[k] = JSON.parse(v);
      } catch {
        out[k] = v;
      }
    }
    return out;
  } catch {
    return {};
  }
}
