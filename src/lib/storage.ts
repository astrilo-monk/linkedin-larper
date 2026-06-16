import { Redis } from "@upstash/redis";
import type { StoredResult } from "./types";

interface ResultStore {
  save(result: StoredResult): Promise<void>;
  get(id: string): Promise<StoredResult | null>;
}

// In-memory fallback if Redis is not configured (for local dev without env vars)
const memoryStore = new Map<string, StoredResult>();

// Initialize Redis if env vars are present
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

export const resultStore: ResultStore = {
  async save(result: StoredResult): Promise<void> {
    if (redis) {
      // Store in Redis with a 30-day expiration (2592000 seconds)
      await redis.set(`larp:${result.id}`, result, { ex: 2592000 });
    } else {
      memoryStore.set(result.id, result);
    }
  },
  async get(id: string): Promise<StoredResult | null> {
    if (redis) {
      return await redis.get<StoredResult>(`larp:${id}`);
    } else {
      return memoryStore.get(id) ?? null;
    }
  },
};
