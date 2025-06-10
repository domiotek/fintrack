import { TimeRangeReq } from '../time-range/time-range-req';

export interface BaseStatsRequest extends TimeRangeReq {
  categoryId?: string | null;
}
