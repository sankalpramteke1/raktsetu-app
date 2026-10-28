import { AppNotification, NotificationSeverity } from '../types/notification';
import { apiRequest } from './apiClient';

interface BackendNotification {
  id: number;
  title: string;
  message: string;
  type?: string;
  severity?: string;
  category?: string;
  read?: boolean;
  action_route?: string;
  created_at?: string;
}

const mapSeverity = (severity?: string): NotificationSeverity => {
  switch (severity?.toLowerCase()) {
    case 'critical': return 'critical';
    case 'warning': return 'warning';
    case 'success': return 'success';
    default: return 'info';
  }
};

const mapBackendNotification = (n: BackendNotification): AppNotification => {
  const createdAt = n.created_at ? new Date(n.created_at) : new Date();
  const now = new Date();
  const isToday = createdAt.toDateString() === now.toDateString();

  return {
    id: `notif-${n.id}`,
    title: n.title,
    message: n.message,
    time: isToday
      ? createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : createdAt.toLocaleDateString([], { day: '2-digit', month: 'short' }),
    date: isToday ? 'Today' : createdAt.toLocaleDateString([], { day: '2-digit', month: 'short' }),
    severity: mapSeverity(n.severity || n.type),
    read: n.read ?? false,
    category: (n.category as AppNotification['category']) || 'system',
    actionRoute: n.action_route,
  };
};

export const notificationService = {
  getNotifications: async (): Promise<AppNotification[]> => {
    const res = await apiRequest<{ notifications: BackendNotification[] } | BackendNotification[]>('/notifications');
    const list = Array.isArray(res) ? res : (res as any)?.notifications;
    if (Array.isArray(list) && list.length > 0) {
      return list.map(mapBackendNotification);
    }
    return [];
  },

  getUnreadCount: async (): Promise<number> => {
    const notifications = await notificationService.getNotifications();
    return notifications.filter((n) => !n.read).length;
  },
};
