export type NotificationSeverity = 'critical' | 'warning' | 'info' | 'success';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  date: string;
  severity: NotificationSeverity;
  read: boolean;
  category: 'stock' | 'request' | 'donor' | 'expiry' | 'system';
  actionRoute?: string;
}
