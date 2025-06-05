import { AppState } from '../../models/store/app-state.model';

export const EMPTY_APP_STATE: AppState = {
  id: null,
  email: null,
  firstName: null,
  currency: null,
  currencyList: [],
  isLogged: false,
};
