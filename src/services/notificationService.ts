import { NOTIFICATIONS } from '../data/notifications';
import { AppNotification } from '../types/notification';

export const notificationService = {
  getNotifications: async (): Promise<AppNotification[]> => {
    return Promise.resolve([...NOTIFICATIONS]);
  },

  getUnreadCount: async (): Promise<number> => {
    return Promise.resolve(NOTIFICATIONS.filter((n) => !n.read).length);
  },
};
