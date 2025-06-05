import { EventCurrency } from './event-bill';

export interface EventSummary {
  eventCurrency: EventCurrency;
  userCurrency: EventCurrency;
}
