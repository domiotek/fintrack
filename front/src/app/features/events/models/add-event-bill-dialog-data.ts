import { Currency } from '../../../core/models/currency/currency.model';

export interface AddEventBillDialogData {
  eventId: number;
  eventCurrency: Currency;
  userCurrency: Currency;
}
