import { Bill } from '../../../core/models/bills/bill.model';
import { Currency } from '../../../core/models/currency/currency.model';
import { Event } from '../../../core/models/events/event';
import { EventBill } from '../../../core/models/events/event-bill';

export interface EventBillDialogData {
  event: Event;
  eventCurrency: Currency;
  userCurrency: Currency;
  bill?: EventBill;
}
