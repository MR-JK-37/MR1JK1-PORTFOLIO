/**
 * In-memory rate limiter for login attempts.
 * Keyed by IP address; locks out after MAX_ATTEMPTS for COOLDOWN_MS.
 */

const MAX_ATTEMPTS = 5;
const COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes

interface AttemptRecord {
  count: number;
  firstAttempt: number;
  lockedUntil: number | null;
}

const attempts = new Map<string, AttemptRecord>();

export function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const record = attempts.get(ip);

  if (!record) {
    return { allowed: true };
  }

  /* Check if locked out */
  if (record.lockedUntil && now < record.lockedUntil) {
    const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  /* Reset if lockout expired */
  if (record.lockedUntil && now >= record.lockedUntil) {
    attempts.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const record = attempts.get(ip);

  if (!record) {
    attempts.set(ip, {
      count: 1,
      firstAttempt: now,
      lockedUntil: null,
    });
    return;
  }

  record.count += 1;

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + COOLDOWN_MS;
  }
}

export function resetAttempts(ip: string): void {
  attempts.delete(ip);
}
