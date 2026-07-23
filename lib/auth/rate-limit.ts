const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60 * 1000;

const attempts = new Map<string, { count: number; windowStart: number }>();

// Poznámka: In-memory limiter je per-instance (rovnako ako proxy.ts Sentinel
// limiter). Pre distribuované produkčné prostredie nahraďte zdieľaným úložiskom
// (napr. Upstash/Redis), no pre jednu internú admin appku je to postačujúce.
export function isLoginRateLimited(key: string): boolean {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now - record.windowStart > WINDOW_MS) {
    attempts.set(key, { count: 1, windowStart: now });
    return false;
  }

  if (record.count >= MAX_ATTEMPTS) {
    return true;
  }

  record.count += 1;
  return false;
}

export function resetLoginRateLimit(key: string): void {
  attempts.delete(key);
}
