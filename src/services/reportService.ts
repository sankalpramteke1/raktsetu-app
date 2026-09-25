import {
  BLOOD_GROUP_DISTRIBUTION,
  COLLECTION_TREND_7_DAYS,
  REPORT_INSIGHTS,
  REPORT_SUMMARIES,
} from '../data/reports';
import {
  BloodGroupDistributionItem,
  DailyTrendItem,
  ReportInsight,
  ReportSummary,
  ReportTimeframe,
} from '../types/report';

export const reportService = {
  getSummary: async (timeframe: ReportTimeframe): Promise<ReportSummary> => {
    return Promise.resolve(REPORT_SUMMARIES[timeframe] || REPORT_SUMMARIES['This Month']);
  },

  getTrend: async (): Promise<DailyTrendItem[]> => {
    return Promise.resolve([...COLLECTION_TREND_7_DAYS]);
  },

  getBloodGroupDistribution: async (): Promise<BloodGroupDistributionItem[]> => {
    return Promise.resolve([...BLOOD_GROUP_DISTRIBUTION]);
  },

  getInsights: async (): Promise<ReportInsight[]> => {
    return Promise.resolve([...REPORT_INSIGHTS]);
  },
};
