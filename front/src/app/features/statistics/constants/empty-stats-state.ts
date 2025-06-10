import { DateTime } from 'luxon';
import { IStatsState } from '../models/stats-state';

export const EMPTY_STATS_STATE: IStatsState = {
  timeRange: {
    from: DateTime.now().startOf('month'),
    to: DateTime.now().endOf('month'),
  },
};
