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
    const emptyState: AppState = { ...EMPTY_APP_STATE, currencyList: state.currencyList };

    return { ...state, emptyState };
  });

  readonly appState$ = this.select((state) => state);

  readonly userName$ = this.select((state) => state?.firstName);

  readonly currencyList$ = this.select((state) => state.currencyList);
}
