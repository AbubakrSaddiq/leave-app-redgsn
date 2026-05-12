// ============================================
// Rate Limiting Utility
// Client-side rate limiting with localStorage fallback
// ============================================

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number; // in milliseconds
  keyPrefix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number; // timestamp when limit resets
  retryAfter?: number; // seconds to wait before retry
}

// Default configs for different endpoints
export const RATE_LIMIT_CONFIGS = {
  AUTH_LOGIN: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    keyPrefix: 'rl:auth:login',
  },
  AUTH_SIGNUP: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000,
    keyPrefix: 'rl:auth:signup',
  },
  AUTH_PASSWORD_RESET: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    keyPrefix: 'rl:auth:reset',
  },
  API_GENERAL: {
    maxAttempts: 30,
    windowMs: 60 * 1000, // 1 minute
    keyPrefix: 'rl:api:general',
  },
  API_MUTATIONS: {
    maxAttempts: 20,
    windowMs: 60 * 1000,
    keyPrefix: 'rl:api:mutations',
  },
  LEAVE_APPLICATION: {
    maxAttempts: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
    keyPrefix: 'rl:leave:submit',
  },
} as const;

/**
 * In-memory store for rate limiting (resets on page reload)
 */
class RateLimitStore {
  private store = new Map<string, { count: number; resetTime: number }>();

  get(key: string): { count: number; resetTime: number } | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    // If window has passed, reset
    if (Date.now() > entry.resetTime) {
      this.store.delete(key);
      return null;
    }

    return entry;
  }

  set(key: string, count: number, resetTime: number): void {
    this.store.set(key, { count, resetTime });
  }

  increment(key: string, windowMs: number): void {
    const current = this.get(key);
    const now = Date.now();
    const resetTime = current?.resetTime || now + windowMs;

    if (current) {
      this.set(key, current.count + 1, resetTime);
    } else {
      this.set(key, 1, resetTime);
    }
  }

  clear(key: string): void {
    this.store.delete(key);
  }

  clearAll(): void {
    this.store.clear();
  }
}

/**
 * Persistent store using localStorage
 */
class PersistentRateLimitStore {
  private prefix = 'rl:';

  private getStorageKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  get(key: string): { count: number; resetTime: number } | null {
    try {
      const item = localStorage.getItem(this.getStorageKey(key));
      if (!item) return null;

      const data = JSON.parse(item);

      // If window has passed, delete and return null
      if (Date.now() > data.resetTime) {
        localStorage.removeItem(this.getStorageKey(key));
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }

  set(key: string, count: number, resetTime: number): void {
    try {
      localStorage.setItem(
        this.getStorageKey(key),
        JSON.stringify({ count, resetTime })
      );
    } catch (error) {
      console.warn('Failed to persist rate limit data:', error);
    }
  }

  increment(key: string, windowMs: number): void {
    const current = this.get(key);
    const now = Date.now();
    const resetTime = current?.resetTime || now + windowMs;

    if (current) {
      this.set(key, current.count + 1, resetTime);
    } else {
      this.set(key, 1, resetTime);
    }
  }

  clear(key: string): void {
    try {
      localStorage.removeItem(this.getStorageKey(key));
    } catch {
      // Silently fail
    }
  }

  clearAll(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch {
      // Silently fail
    }
  }
}

// Create singleton instances
const memoryStore = new RateLimitStore();
const persistentStore = new PersistentRateLimitStore();

/**
 * Check if a request should be rate limited
 * Uses both memory and localStorage for redundancy
 */
export function checkRateLimit(
  identifier: string, // e.g., email, IP, or user ID
  config: RateLimitConfig
): RateLimitResult {
  const key = `${config.keyPrefix}:${identifier}`;
  const now = Date.now();

  // Try memory store first
  let entry = memoryStore.get(key);

  // Fallback to localStorage
  if (!entry) {
    entry = persistentStore.get(key);
  }

  const remaining = entry
    ? Math.max(0, config.maxAttempts - entry.count)
    : config.maxAttempts;

  const resetTime = entry?.resetTime || now + config.windowMs;
  const isAllowed = !entry || entry.count < config.maxAttempts;

  return {
    allowed: isAllowed,
    remaining,
    resetTime,
    retryAfter: isAllowed ? undefined : Math.ceil((resetTime - now) / 1000),
  };
}

/**
 * Record an attempt for rate limiting
 */
export function recordAttempt(
  identifier: string,
  config: RateLimitConfig
): void {
  const key = `${config.keyPrefix}:${identifier}`;

  memoryStore.increment(key, config.windowMs);
  persistentStore.increment(key, config.windowMs);
}

/**
 * Clear rate limit for an identifier
 */
export function clearRateLimit(
  identifier: string,
  config: RateLimitConfig
): void {
  const key = `${config.keyPrefix}:${identifier}`;

  memoryStore.clear(key);
  persistentStore.clear(key);
}

/**
 * Clear all rate limits (useful on logout)
 */
export function clearAllRateLimits(): void {
  memoryStore.clearAll();
  persistentStore.clearAll();
}

/**
 * Hook for React components to use rate limiting
 */
export function useRateLimit(config: RateLimitConfig, identifier?: string) {
  const getId = () => {
    if (identifier) return identifier;
    // Default: use current pathname
    return window.location.pathname;
  };

  const check = (): RateLimitResult => {
    return checkRateLimit(getId(), config);
  };

  const record = (): void => {
    recordAttempt(getId(), config);
  };

  const clear = (): void => {
    clearRateLimit(getId(), config);
  };

  return { check, record, clear };
}
