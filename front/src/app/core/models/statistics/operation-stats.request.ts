import { BaseStatsRequest } from './base-stats-request';
import { StatsOperationType } from './stats-operations';

export interface OperationStatsRequest extends BaseStatsRequest {
  operation: StatsOperationType;
}
