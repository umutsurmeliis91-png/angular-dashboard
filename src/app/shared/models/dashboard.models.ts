export type TrendDirection = 'up' | 'down';
export type KpiAccent = 'primary' | 'success' | 'warning' | 'danger';

export interface KpiCardData {
  title: string;
  value: string;
  icon: string;
  changePercent: number;
  trend: TrendDirection;
  accent: KpiAccent;
}

export interface ActivityItem {
  id: number;
  user: string;
  action: string;
  time: string;
  icon: string;
  accent: KpiAccent;
}
