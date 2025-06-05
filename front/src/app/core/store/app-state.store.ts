import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { AppState } from '../models/store/app-state.model';
import { EMPTY_APP_STATE } from '../constants/store/empty-app-state';

@Injectable()
export class AppStateStore extends ComponentStore<AppState> {
  constructor() {
    super(EMPTY_APP_STATE);
  }

  readonly setAppState = this.updater<Partial<AppState>>((state, newState) => ({
    ...state,
    ...newState,
  }));

  readonly setCurrenciesList = this.updater<AppState['currencyList']>((state, newState) => ({
    ...state,
    currencyList: newState,
  }));

  readonly logout = this.updater((state) => {
    return {
      ...EMPTY_APP_STATE,
      currencyList: state.currencyList,
    };
  });

  readonly appState$ = this.select((state) => state);

  readonly userId = this.select((state) => state?.id);

  readonly userName$ = this.select((state) => state?.firstName);

  readonly userDefaultCurrency$ = this.select((state) => state?.currency);

  readonly currencyList$ = this.select((state) => state.currencyList);
}
