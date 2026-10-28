import { BloodGroup } from '../types/blood';
import {
  BloodGroupDistributionItem,
  DailyTrendItem,
  ReportInsight,
  ReportSummary,
  ReportTimeframe,
} from '../types/report';
import { bloodStockService } from './bloodStockService';
import { donorService } from './donorService';
import { requestService } from './requestService';

export const reportService = {
  getSummary: async (_timeframe: ReportTimeframe): Promise<ReportSummary> => {
    try {
      const [stats, requests, donors] = await Promise.all([
        bloodStockService.getStockSummary().catch(() => ({ totalUnits: 0, criticalCount: 0, lowCount: 0, addedToday: 0, issuedToday: 0 })),
        requestService.getAllRequests().catch(() => []),
        donorService.getAllDonors().catch(() => []),
      ]);

      const pendingCount = requests.filter((r) => r.status === 'Pending').length;
      const totalDonations = donors.reduce((sum, d) => sum + (d.totalDonations || 0), 0);

      return {
        totalDonations: totalDonations > 0 ? totalDonations : donors.length,
        bloodCollectedUnits: stats.totalUnits,
        bloodIssuedUnits: stats.issuedToday,
        bloodRequestsCount: requests.length,
        newDonorsCount: donors.length,
        pendingRequestsCount: pendingCount,
        quarantinedUnits: 0,
        wastageRatePercent: 0,
      };
    } catch {
      return {
        totalDonations: 0,
        bloodCollectedUnits: 0,
        bloodIssuedUnits: 0,
        bloodRequestsCount: 0,
        newDonorsCount: 0,
        pendingRequestsCount: 0,
        quarantinedUnits: 0,
        wastageRatePercent: 0,
      };
    }
  },

  getTrend: async (): Promise<DailyTrendItem[]> => {
    try {
      const stats = await bloodStockService.getStockSummary().catch(() => ({ addedToday: 0, issuedToday: 0 }));
      const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      return [
        {
          day: today,
          date: dateStr,
          collected: stats.addedToday || 0,
          issued: stats.issuedToday || 0,
        },
      ];
    } catch {
      return [];
    }
  },

  getBloodGroupDistribution: async (): Promise<BloodGroupDistributionItem[]> => {
    try {
      const stock = await bloodStockService.getAllStock();
      const totalUnits = stock.reduce((sum, item) => sum + item.units, 0);

      const allGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
      return allGroups.map((group) => {
        const item = stock.find((s) => s.bloodGroup === group);
        const units = item ? item.units : 0;
        const percentage = totalUnits > 0 ? Math.round((units / totalUnits) * 100) : 0;
        return {
          bloodGroup: group,
          percentage,
          units,
        };
      });
    } catch {
      return [];
    }
  },

  getInsights: async (): Promise<ReportInsight[]> => {
    try {
      const [stats, requests, donors] = await Promise.all([
        bloodStockService.getStockSummary().catch(() => ({ totalUnits: 0, criticalCount: 0, lowCount: 0, addedToday: 0, issuedToday: 0 })),
        requestService.getAllRequests().catch(() => []),
        donorService.getAllDonors().catch(() => []),
      ]);

      const pendingCount = requests.filter((r) => r.status === 'Pending').length;

      const insights: ReportInsight[] = [
        {
          id: 'ins-1',
          title: 'Total Blood Units Available',
          value: `${stats.totalUnits} Units`,
          subtitle: 'Live count across all blood groups',
          icon: 'water',
          type: 'primary',
        },
        {
          id: 'ins-2',
          title: 'Active Blood Requisitions',
          value: `${pendingCount} Pending`,
          subtitle: `Out of ${requests.length} total hospital requests`,
          icon: 'git-pull-request',
          type: pendingCount > 0 ? 'warning' : 'success',
        },
        {
          id: 'ins-3',
          title: 'Registered Donors',
          value: `${donors.length} Donors`,
          subtitle: 'Available in central hospital network',
          icon: 'people',
          type: 'info',
        },
      ];

      if (stats.criticalCount > 0) {
        insights.push({
          id: 'ins-4',
          title: 'Critical Stock Shortage',
          value: `${stats.criticalCount} Groups`,
          subtitle: 'Requires immediate replenishment',
          icon: 'alert-circle',
          type: 'warning',
        });
      }

      return insights;
    } catch {
      return [];
    }
  },
};
