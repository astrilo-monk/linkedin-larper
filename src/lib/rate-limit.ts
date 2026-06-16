import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Initialize Redis if env vars are present
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// Create a new ratelimiter, that allows 10 requests per 1 minute
const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      analytics: true,
    })
  : null;

// In-memory fallback for local dev
const fallbackClients = new Map<string, number[]>();

export async function checkRateLimit(ip: string): Promise<{
  success: boolean;
  remaining: number;
  retryAfter?: number;
}> {
  if (ratelimit) {
    const { success, remaining, reset } = await ratelimit.limit(`ratelimit_${ip}`);
    return {
      success,
      remaining,
      retryAfter: success ? undefined : Math.ceil((reset - Date.now()) / 1000),
    };
  }

  // Fallback to in-memory rate limiting (10 req / min)
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 10;
  
  const timestamps = fallbackClients.get(ip) ?? [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);
  
  if (validTimestamps.length >= maxRequests) {
    const oldestInWindow = validTimestamps[0];
    const retryAfter = Math.ceil((oldestInWindow + windowMs - now) / 1000);
    return { success: false, remaining: 0, retryAfter };
  }

  validTimestamps.push(now);
  fallbackClients.set(ip, validTimestamps);
  
  // Clean up memory store
  if (fallbackClients.size > 10000) fallbackClients.clear();

  return {
    success: true,
    remaining: maxRequests - validTimestamps.length,
  };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "127.0.0.1";
}
