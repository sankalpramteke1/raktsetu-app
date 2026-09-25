import {
  BloodGroupDistributionItem,
  DailyTrendItem,
  ReportInsight,
  ReportSummary,
  ReportTimeframe,
} from '../types/report';

export const REPORT_SUMMARIES: Record<ReportTimeframe, ReportSummary> = {
  Today: {
    totalDonations: 24,
    bloodCollectedUnits: 24,
    bloodIssuedUnits: 17,
    bloodRequestsCount: 14,
    newDonorsCount: 8,
    pendingRequestsCount: 7,
    quarantinedUnits: 1,
    wastageRatePercent: 0.4,
  },
  'This Week': {
    totalDonations: 128,
    bloodCollectedUnits: 136,
    bloodIssuedUnits: 98,
    bloodRequestsCount: 112,
    newDonorsCount: 26,
    pendingRequestsCount: 9,
    quarantinedUnits: 3,
    wastageRatePercent: 0.8,
  },
  'This Month': {
    totalDonations: 486,
    bloodCollectedUnits: 512,
    bloodIssuedUnits: 352,
    bloodRequestsCount: 391,
    newDonorsCount: 78,
    pendingRequestsCount: 12,
    quarantinedUnits: 6,
    wastageRatePercent: 1.1,
  },
  Custom: {
    totalDonations: 215,
    bloodCollectedUnits: 228,
    bloodIssuedUnits: 165,
    bloodRequestsCount: 178,
    newDonorsCount: 39,
    pendingRequestsCount: 8,
    quarantinedUnits: 2,
    wastageRatePercent: 0.7,
  },
};

export const COLLECTION_TREND_7_DAYS: DailyTrendItem[] = [
  { day: 'Fri', date: '18 Sep', collected: 47, issued: 39 },
  { day: 'Sat', date: '19 Sep', collected: 55, issued: 42 },
  { day: 'Sun', date: '20 Sep', collected: 31, issued: 24 },
  { day: 'Mon', date: '21 Sep', collected: 42, issued: 28 },
  { day: 'Tue', date: '22 Sep', collected: 51, issued: 34 },
  { day: 'Wed', date: '23 Sep', collected: 38, issued: 29 },
  { day: 'Thu', date: '24 Sep', collected: 64, issued: 48 },
];

export const BLOOD_GROUP_DISTRIBUTION: BloodGroupDistributionItem[] = [
  { bloodGroup: 'O+', percentage: 31, units: 71 },
  { bloodGroup: 'B+', percentage: 22, units: 58 },
  { bloodGroup: 'A+', percentage: 18, units: 42 },
  { bloodGroup: 'AB+', percentage: 10, units: 19 },
  { bloodGroup: 'B-', percentage: 5, units: 11 },
  { bloodGroup: 'A-', percentage: 4, units: 8 },
  { bloodGroup: 'O-', percentage: 3, units: 6 },
  { bloodGroup: 'AB-', percentage: 2, units: 4 },
];

export const REPORT_INSIGHTS: ReportInsight[] = [
  {
    id: 'ins-1',
    title: 'Highest Collection',
    value: 'O+ — 158 units',
    subtitle: 'Driven by Padmanabhpur & Bhilai drives',
    icon: 'water-outline',
    type: 'success',
  },
  {
    id: 'ins-2',
    title: 'Most Requested',
    value: 'B+ — 94 requests',
    subtitle: 'Elevated demand in Trauma ICU & General Surgery',
    icon: 'trending-up-outline',
    type: 'primary',
  },
  {
    id: 'ins-3',
    title: 'Highest Donor Activity',
    value: 'September 2026',
    subtitle: '78 new registered voluntary donors',
    icon: 'people-outline',
    type: 'info',
  },
  {
    id: 'ins-4',
    title: 'Current Low Stock',
    value: 'O- (6 units left)',
    subtitle: 'Safety threshold recommendation: 15 units',
    icon: 'alert-circle-outline',
    type: 'warning',
  },
];
