import { Currency } from '../currency/currency.model';

export interface AppState {
  id: number | null;
  email: string | null;
  firstName: string | null;
  currency: Currency | null;
  currencyList: Currency[];
  isLogged: boolean;
}
