import { BloodBag, BloodGroup, BloodStockItem, StockStatus, StockSummaryStats } from '../types/blood';
import { apiRequest } from './apiClient';

interface BackendInventoryItem {
  blood_type: string;
  units_available: number;
  low_threshold: number;
  critical_threshold: number;
  last_updated?: string;
  level?: 'critical' | 'low' | 'adequate' | string;
}

interface BackendBatchItem {
  id: number;
  blood_type: string;
  units: number;
  collected_date: string;
  expiry_date: string;
  donor_id: number;
  status: string;
  location: string;
  ref_no: string;
  lot_no: string;
  mfg_date: string;
  collected_typed_by?: string;
  donor_name?: string;
}

interface DashboardSummaryResponse {
  inventory: BackendInventoryItem[];
  totals: {
    total_units: number;
    donors: number;
  };
  pipeline: {
    bags_pending_testing: number;
    bags_tested_today: number;
    pending_requisitions: number;
    awaiting_issue: number;
    issued_today: number;
  };
}

const mapLevelToStatus = (level?: string, units = 0, critical = 4, low = 10): StockStatus => {
  if (level === 'critical' || units <= critical) return 'Critical';
  if (level === 'low' || units <= low) return 'Low';
  if (units > low * 1.5) return 'Healthy';
  return 'Moderate';
};

const mapBackendStockItem = (item: BackendInventoryItem): BloodStockItem => {
  const bloodGroup = item.blood_type as BloodGroup;
  const status = mapLevelToStatus(
    item.level,
    item.units_available,
    item.critical_threshold,
    item.low_threshold
  );

  return {
    bloodGroup,
    units: item.units_available,
    status,
    recommendedMin: item.low_threshold || 15,
    optimalLevel: (item.low_threshold || 15) * 2,
    lastUpdated: item.last_updated ? `Updated ${item.last_updated.slice(0, 16)}` : 'Live from Central DB',
    storageLocations: [
      `Main Blood Bank (Rack ${bloodGroup.replace('+', '-Pos').replace('-', '-Neg')})`,
    ],
  };
};

const mapBatchToBloodBag = (batch: BackendBatchItem): BloodBag => {
  const isExpired = new Date(batch.expiry_date) < new Date();
  return {
    bagId: `BB-${batch.lot_no || '2026'}-${String(batch.id).padStart(4, '0')}`,
    bloodGroup: batch.blood_type as BloodGroup,
    collectionDate: batch.collected_date,
    expiryDate: batch.expiry_date,
    volumeMl: 450,
    storage: batch.location || 'Cold Storage Unit 01',
    status: isExpired ? 'Expired' : batch.status === 'pending_testing' ? 'Quarantined' : 'Available',
    componentType: 'Whole Blood',
    donorId: `BD-${batch.donor_id}`,
    testedSafe: batch.status !== 'pending_testing',
  };
};

export const bloodStockService = {
  getAllStock: async (): Promise<BloodStockItem[]> => {
    const summary = await apiRequest<DashboardSummaryResponse>('/dashboard/summary');
    if (summary?.inventory && summary.inventory.length > 0) {
      return summary.inventory.map(mapBackendStockItem);
    }
    return [];
  },

  getStockByGroup: async (group: BloodGroup): Promise<BloodStockItem | undefined> => {
    const all = await bloodStockService.getAllStock();
    return all.find((item) => item.bloodGroup === group);
  },

  getStockSummary: async (): Promise<StockSummaryStats> => {
    const summary = await apiRequest<DashboardSummaryResponse>('/dashboard/summary');
    if (summary?.inventory) {
      const criticalCount = summary.inventory.filter(
        (i) => i.level === 'critical' || i.units_available <= i.critical_threshold
      ).length;
      const lowCount = summary.inventory.filter(
        (i) => i.level === 'low' || (i.units_available <= i.low_threshold && i.units_available > i.critical_threshold)
      ).length;

      return {
        totalUnits: summary.totals?.total_units ?? summary.inventory.reduce((a, b) => a + b.units_available, 0),
        criticalCount,
        lowCount,
        addedToday: summary.pipeline?.bags_tested_today || 0,
        issuedToday: summary.pipeline?.issued_today || 0,
      };
    }
    return {
      totalUnits: 0,
      criticalCount: 0,
      lowCount: 0,
      addedToday: 0,
      issuedToday: 0,
    };
  },

  getBagsForGroup: async (group: BloodGroup): Promise<BloodBag[]> => {
    const batches = await apiRequest<BackendBatchItem[]>('/inventory/batches');
    if (Array.isArray(batches) && batches.length > 0) {
      return batches.filter((b) => b.blood_type === group).map(mapBatchToBloodBag);
    }
    return [];
  },

  getAllBags: async (): Promise<BloodBag[]> => {
    const batches = await apiRequest<BackendBatchItem[]>('/inventory/batches');
    if (Array.isArray(batches) && batches.length > 0) {
      return batches.map(mapBatchToBloodBag);
    }
    return [];
  },
};
