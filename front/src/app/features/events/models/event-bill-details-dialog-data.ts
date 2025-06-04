import { Currency } from '../../../core/models/currency/currency.model';
import { Event } from '../../../core/models/events/event';
import { EventBill } from './../../../core/models/events/event-bill';

export interface EventBillDetailsDialogData {
  eventBill: EventBill;
  event: Event;
  userCurrency: Currency;
  eventCurrency: Currency;
  userId: number;
}
