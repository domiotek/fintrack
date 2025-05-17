import { Currency } from '../currency/currency.model';

export interface ConfigResponse {
  email: string;
  firstName: string;
  currency: Currency;
}
