import { ActivityItemType } from '../types/activity';
import { AppNotification } from '../types/notification';
import { notificationService } from './notificationService';

export const activityService = {
  getRecentActivities: async (limit: number = 10): Promise<ActivityItemType[]> => {
    try {
      const notifs: AppNotification[] = await notificationService.getNotifications();
      return notifs.slice(0, limit).map((n: AppNotification) => ({
        id: `act-${n.id}`,
        type: 'alert',
        title: n.title,
        description: n.message,
        time: n.time,
        timestamp: n.date,
        referenceId: n.actionRoute,
      }));
    } catch {
      return [];
    }
  },

  getAllActivities: async (): Promise<ActivityItemType[]> => {
    return activityService.getRecentActivities(50);
  },
};
