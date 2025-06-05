import { Currency } from '../currency/currency.model';

export interface ConfigResponse {
  id: number;
  email: string;
  firstName: string;
  currency: Currency;
}
