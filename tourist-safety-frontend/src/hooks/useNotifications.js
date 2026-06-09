import { useCallback, useEffect, useState } from 'react';
import { notificationService } from '../services/notificationService';
import { useAuth } from './useAuth';

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await notificationService.getAll();

      console.log('Notifications API Response:', data);

      if (Array.isArray(data)) {
        setNotifications(data);
      } else if (Array.isArray(data?.notifications)) {
        setNotifications(data.notifications);
      } else if (Array.isArray(data?.data)) {
        setNotifications(data.data);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const safeNotifications = Array.isArray(notifications)
    ? notifications
    : [];

  return {
    notifications: safeNotifications,
    loading,
    unreadCount: safeNotifications.filter((n) => n.unread).length,
    refresh,
  };
}