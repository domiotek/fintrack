import { EventStatus } from './event-status.enum';

export interface EventFilters {
  name?: string | null;
  eventStatus?: EventStatus | null;
  from?: string | null;
  to?: string | null;
}
