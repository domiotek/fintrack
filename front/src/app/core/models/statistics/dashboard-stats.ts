import { Stats } from './stats.model';

export interface DashboardStats {
  totalSpending: number;
  previousMonthDifference: number;
  chartData: Stats;
}
