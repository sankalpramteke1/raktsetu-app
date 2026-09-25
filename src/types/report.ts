import { BloodGroup } from './blood';

export type ReportTimeframe = 'Today' | 'This Week' | 'This Month' | 'Custom';

export interface ReportSummary {
  totalDonations: number;
  bloodCollectedUnits: number;
  bloodIssuedUnits: number;
  bloodRequestsCount: number;
  newDonorsCount: number;
  pendingRequestsCount: number;
  quarantinedUnits: number;
  wastageRatePercent: number;
}

export interface DailyTrendItem {
  day: string;
  date: string;
  collected: number;
  issued: number;
}

export interface BloodGroupDistributionItem {
  bloodGroup: BloodGroup;
  percentage: number;
  units: number;
}

export interface ReportInsight {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  type: 'success' | 'warning' | 'info' | 'primary';
}
