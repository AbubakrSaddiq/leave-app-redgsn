// ============================================
// React Query Integration for Rate Limiting
// ============================================

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';
import {
  checkRateLimit,
  recordAttempt,
  RATE_LIMIT_CONFIGS,
  type RateLimitConfig,
  type RateLimitResult,
} from '@/utils/rateLimit';
import { RateLimitError } from '@/utils/rateLimitedApi';

/**
 * Custom hook for rate-limited mutations
 * Automatically enforces rate limiting for any mutation
 */
export function useRateLimitedMutation<
  TData,
  TError extends Error = Error,
  TVariables = void,
  TContext = unknown
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  config: RateLimitConfig,
  identifierFn?: (variables: TVariables) => string,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    'mutationFn'
  >
) {
  const toast = useToast();

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const identifier = identifierFn
        ? identifierFn(variables)
        : 'default-mutation';

      // Check rate limit
      const rateLimitResult = checkRateLimit(identifier, config);

      if (!rateLimitResult.allowed) {
        throw new RateLimitError(
          rateLimitResult,
          `Too many requests. Please wait ${rateLimitResult.retryAfter} seconds before trying again.`
        );
      }

      try {
        const result = await mutationFn(variables);
        return result;
      } catch (error) {
        // Record failed attempt
        recordAttempt(identifier, config);
        throw error;
      }
    },
    onError: (error: TError) => {
      // Handle rate limit errors
      if (error instanceof RateLimitError) {
        toast({
          title: 'Rate Limit Exceeded',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Call original error handler if provided
        options?.onError?.(error, undefined as TVariables, undefined as TContext);
      }
    },
    ...options,
  });
}

/**
 * Hook to check and display rate limit status
 */
export function useRateLimitStatus(
  config: RateLimitConfig,
  identifier: string
) {
  const check = () => {
    return checkRateLimit(identifier, config);
  };

  const status = check();

  return {
    isLimited: !status.allowed,
    remaining: status.remaining,
    maxAttempts: config.maxAttempts,
    resetTime: status.resetTime,
    retryAfter: status.retryAfter,
    percentageRemaining: (status.remaining / config.maxAttempts) * 100,
  };
}

/**
 * Example usage in hooks:
 * 
 * export const useCreateLeaveWithRateLimit = () => {
 *   return useRateLimitedMutation(
 *     createLeaveApplication,
 *     RATE_LIMIT_CONFIGS.LEAVE_APPLICATION,
 *     () => 'leave-submission',
 *     {
 *       onSuccess: () => {
 *         // custom success handling
 *       }
 *     }
 *   );
 * };
 */
