import { TimeRangeReq } from '../time-range/time-range-req';

export interface CategoryFilters extends TimeRangeReq {
  name?: string | null;
}
