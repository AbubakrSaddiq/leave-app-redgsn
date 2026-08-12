// src/hooks/useAnalytics.ts
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/api/analytics.api';
import { useAuth } from './useAuth';

export const useDirectorAnalytics = () => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['analytics', 'director', profile?.id],
    queryFn: () => {
      if (!profile?.id) throw new Error('User not authenticated');
      return analyticsApi.getDirectorAnalytics(profile.id);
    },
    enabled: !!profile?.id && profile?.role === 'director',
    staleTime: 60000, // 1 minute
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useHRAnalytics = () => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['analytics', 'hr'],
    queryFn: () => analyticsApi.getHRAnalytics(),
    enabled: !!profile?.id && (profile?.role === 'hr' || profile?.role === 'admin'),
    staleTime: 60000,
    refetchInterval: 60000,
  });
};