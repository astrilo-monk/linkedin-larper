import { RATE_LIMIT } from "./constants";

interface RateLimitEntry {
  timestamps: number[];
}

const clients = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of clients.entries()) {
      entry.timestamps = entry.timestamps.filter(
        (t) => now - t < RATE_LIMIT.windowMs
      );
      if (entry.timestamps.length === 0) {
        clients.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export function checkRateLimit(ip: string): {
  success: boolean;
  remaining: number;
  retryAfter?: number;
} {
  const now = Date.now();
  const entry = clients.get(ip) ?? { timestamps: [] };

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter(
    (t) => now - t < RATE_LIMIT.windowMs
  );

  if (entry.timestamps.length >= RATE_LIMIT.maxRequests) {
    const oldestInWindow = entry.timestamps[0];
    const retryAfter = Math.ceil(
      (oldestInWindow + RATE_LIMIT.windowMs - now) / 1000
    );
    return { success: false, remaining: 0, retryAfter };
  }

  entry.timestamps.push(now);
  clients.set(ip, entry);

  return {
    success: true,
    remaining: RATE_LIMIT.maxRequests - entry.timestamps.length,
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
