import { Currency } from '../currency/currency.model';

export interface AppState {
  userId: number | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  currency: Currency | null;
  currencyList: Currency[];
  isLogged: boolean;
}
