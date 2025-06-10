import { BaseStatsRequest } from './base-stats-request';
import { StatsGroupsType } from './stats-groups';

export interface GroupedStatsRequest extends BaseStatsRequest {
  group: StatsGroupsType;
}
