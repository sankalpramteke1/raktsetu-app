import { INITIAL_BLOOD_STOCK, INITIAL_STOCK_STATS } from '../data/bloodStock';
import { BLOOD_BAGS, getBagsForGroup } from '../data/bloodBags';
import { BloodBag, BloodGroup, BloodStockItem, StockSummaryStats } from '../types/blood';

export const bloodStockService = {
  getAllStock: async (): Promise<BloodStockItem[]> => {
    return Promise.resolve([...INITIAL_BLOOD_STOCK]);
  },

  getStockByGroup: async (group: BloodGroup): Promise<BloodStockItem | undefined> => {
    return Promise.resolve(INITIAL_BLOOD_STOCK.find((item) => item.bloodGroup === group));
  },

  getStockSummary: async (): Promise<StockSummaryStats> => {
    return Promise.resolve({ ...INITIAL_STOCK_STATS });
  },

  getBagsForGroup: async (group: BloodGroup): Promise<BloodBag[]> => {
    return Promise.resolve(getBagsForGroup(group));
  },

  getAllBags: async (): Promise<BloodBag[]> => {
    return Promise.resolve([...BLOOD_BAGS]);
  },
};
