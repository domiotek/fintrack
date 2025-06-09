import { TimeRangeReq } from '../time-range/time-range-req';

export interface DashboardStatsRequest extends TimeRangeReq {
  categoryId?: string | null;
}
