import { AppState } from '../../models/store/app-state.model';

export const EMPTY_APP_STATE: AppState = {
  userId: null,
  email: null,
  firstName: null,
  currency: null,
  currencyList: [],
  isLogged: false,
};
