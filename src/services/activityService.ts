import { ACTIVITIES } from '../data/activities';
import { ActivityItemType } from '../types/activity';

export const activityService = {
  getRecentActivities: async (limit: number = 10): Promise<ActivityItemType[]> => {
    return Promise.resolve(ACTIVITIES.slice(0, limit));
  },

  getAllActivities: async (): Promise<ActivityItemType[]> => {
    return Promise.resolve([...ACTIVITIES]);
  },
};
