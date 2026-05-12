// ============================================
// Rate Limited API Client
// Wraps all API calls with rate limiting
// ============================================

import {
  checkRateLimit,
  recordAttempt,
  RATE_LIMIT_CONFIGS,
  type RateLimitConfig,
  type RateLimitResult,
} from '@/utils/rateLimit';

export class RateLimitError extends Error {
  constructor(
    public rateLimitInfo: RateLimitResult,
    message: string = 'Too many requests. Please try again later.'
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

/**
 * Wraps an async function with rate limiting
 */
export async function withRateLimit<T>(
  fn: () => Promise<T>,
  config: RateLimitConfig,
  identifier: string
): Promise<T> {
  // Check rate limit
  const rateLimitResult = checkRateLimit(identifier, config);

  if (!rateLimitResult.allowed) {
    throw new RateLimitError(
      rateLimitResult,
      `Too many attempts. Please wait ${rateLimitResult.retryAfter} seconds before trying again.`
    );
  }

  try {
    const result = await fn();
    return result;
  } catch (error) {
    // Record the attempt regardless of success or failure
    recordAttempt(identifier, config);
    throw error;
  }
}

/**
 * Create a rate-limited mutation wrapper for React Query
 */
export function createRateLimitedMutation<TData, TError, TVariables>(
  config: RateLimitConfig,
  identifierFn?: (variables: TVariables) => string
) {
  return {
    onMutate: async (variables: TVariables) => {
      const identifier = identifierFn ? identifierFn(variables) : 'default';
      const rateLimitResult = checkRateLimit(identifier, config);

      if (!rateLimitResult.allowed) {
        throw new RateLimitError(
          rateLimitResult,
          `Too many attempts. Please wait ${rateLimitResult.retryAfter} seconds before trying again.`
        );
      }

      return { identifier };
    },
    onError: (
      error: unknown,
      _variables: TVariables,
      context?: { identifier: string }
    ) => {
      // Record failed attempt
      if (context?.identifier) {
        recordAttempt(context.identifier, config);
      }
    },
  };
}

/**
 * Middleware for wrapping API functions
 */
export function apiWithRateLimit<Args extends any[], R>(
  fn: (...args: Args) => Promise<R>,
  config: RateLimitConfig,
  identifierFn?: (...args: Args) => string
) {
  return async (...args: Args): Promise<R> => {
    const identifier = identifierFn ? identifierFn(...args) : 'default';
    return withRateLimit(() => fn(...args), config, identifier);
  };
}
