// Simple in-memory rate limiter for tRPC mutations
// Maps IP address to array of timestamps
const requestLog = new Map<string, number[]>();

const WINDOW_MS = 60 * 1000; // 1 minute window

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 30,
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  // Get existing timestamps for this identifier
  const timestamps = requestLog.get(identifier) || [];

  // Filter to only timestamps within the current window
  const recentTimestamps = timestamps.filter((t) => t > windowStart);

  // Clean up old entries periodically
  if (recentTimestamps.length < timestamps.length) {
    requestLog.set(identifier, recentTimestamps);
  }

  const allowed = recentTimestamps.length < maxRequests;
  const remaining = Math.max(0, maxRequests - recentTimestamps.length);
  const oldestInWindow = recentTimestamps[0] || now;
  const resetIn = Math.max(0, oldestInWindow + WINDOW_MS - now);

  if (allowed) {
    recentTimestamps.push(now);
    requestLog.set(identifier, recentTimestamps);
  }

  return { allowed, remaining, resetIn };
}

// Stricter rate limits for auth mutations
export function checkAuthRateLimit(
  identifier: string,
): { allowed: boolean; remaining: number; resetIn: number } {
  return checkRateLimit(`auth:${identifier}`, 5);
}

// Rate limit for coaching (AI endpoints)
export function checkCoachingRateLimit(
  identifier: string,
): { allowed: boolean; remaining: number; resetIn: number } {
  return checkRateLimit(`coach:${identifier}`, 10);
}

// General API rate limit
export function checkApiRateLimit(
  identifier: string,
): { allowed: boolean; remaining: number; resetIn: number } {
  return checkRateLimit(`api:${identifier}`, 60);
}
