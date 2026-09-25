export type ActivityType =
  | 'issue'
  | 'donor'
  | 'crossmatch'
  | 'inventory'
  | 'request'
  | 'alert';

export interface ActivityItemType {
  id: string;
  time: string;
  timestamp: string;
  title: string;
  description: string;
  type: ActivityType;
  referenceId?: string;
}
