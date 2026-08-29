// src/api/notifications.api.ts
import { supabase } from '@/lib/supabase';
import { Notification, NotificationType } from '@/types/models';

export interface NotificationWithDetails extends Notification {
  related_leave?: {
    application_number: string;
    leave_type: string;
    start_date: string;
    end_date: string;
  };
}

// ============================================
// GET NOTIFICATIONS
// ============================================

/**
 * Get all notifications for the current user
 */
export async function getMyNotifications(params?: {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
}): Promise<{ data: NotificationWithDetails[]; count: number }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { limit = 50, offset = 0, unreadOnly = false } = params || {};

    let query = supabase
      .from('notifications')
      .select(
        `
        *,
        related_leave:related_leave_id (
          application_number,
          leave_type,
          start_date,
          end_date
        )
      `,
        { count: 'exact' }
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data as NotificationWithDetails[],
      count: count || 0,
    };
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    throw new Error(error.message || 'Failed to fetch notifications');
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount(): Promise<number> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return 0;

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) throw error;

    return count || 0;
  } catch (error: any) {
    console.error('Error fetching unread count:', error);
    return 0;
  }
}

// ============================================
// MARK NOTIFICATIONS
// ============================================

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error: any) {
    console.error('Error marking notification as read:', error);
    throw new Error(error.message || 'Failed to mark notification as read');
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) throw error;
  } catch (error: any) {
    console.error('Error marking all notifications as read:', error);
    throw new Error(error.message || 'Failed to mark all notifications as read');
  }
}

// ============================================
// DELETE NOTIFICATIONS
// ============================================

/**
 * Delete a single notification
 */
export async function deleteNotification(notificationId: string): Promise<void> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error: any) {
    console.error('Error deleting notification:', error);
    throw new Error(error.message || 'Failed to delete notification');
  }
}

/**
 * Delete all read notifications
 */
export async function deleteAllReadNotifications(): Promise<void> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', user.id)
      .eq('is_read', true);

    if (error) throw error;
  } catch (error: any) {
    console.error('Error deleting read notifications:', error);
    throw new Error(error.message || 'Failed to delete read notifications');
  }
}