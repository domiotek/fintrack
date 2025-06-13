import { TestBed } from '@angular/core/testing';
import { AppStateStore } from './app-state.store';
import { AppState } from '../models/store/app-state.model';
import { EMPTY_APP_STATE } from '../constants/store/empty-app-state';
import { Currency } from '../models/currency/currency.model';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('AppStateStore', () => {
  let store: AppStateStore;
  const mockCurrency: Currency = {
    id: 1,
    name: 'USD',
    code: '$',
    rate: 1,
  };

  const mockCurrencies: Currency[] = [
    mockCurrency,
    {
      id: 2,
      name: 'EUR',
      code: '€',
      rate: 0.85,
    },
  ];

  const mockAppState: AppState = {
    userId: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    currency: mockCurrency,
    currencyList: mockCurrencies,
    isLogged: true,
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection(), AppStateStore],
    });
    store = TestBed.inject(AppStateStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should initialize with empty app state', (done) => {
    store.appState$.subscribe((state) => {
      expect(state).toEqual(EMPTY_APP_STATE);
      done();
    });
  });

  describe('setAppState', () => {
    it('should update the app state with partial state', (done) => {
      const partialState: Partial<AppState> = {
        userId: 1,
        firstName: 'John',
        isLogged: true,
      };

      store.setAppState(partialState);

      store.appState$.subscribe((state) => {
        expect(state).toEqual({
          ...EMPTY_APP_STATE,
          ...partialState,
        });
        done();
      });
    });

    it('should merge new state with existing state', (done) => {
      // First update
      store.setAppState({ userId: 1, firstName: 'John' });

      // Second update
      store.setAppState({ lastName: 'Doe', isLogged: true });

      store.appState$.subscribe((state) => {
        expect(state).toEqual({
          ...EMPTY_APP_STATE,
          userId: 1,
          firstName: 'John',
          lastName: 'Doe',
          isLogged: true,
        });
        done();
      });
    });
  });

  describe('setCurrenciesList', () => {
    it('should update currencies list', (done) => {
      store.setCurrenciesList(mockCurrencies);

      store.currencyList$.subscribe((currencies) => {
        expect(currencies).toEqual(mockCurrencies);
        done();
      });
    });

    it('should update currencies list in app state', (done) => {
      store.setCurrenciesList(mockCurrencies);

      store.appState$.subscribe((state) => {
        expect(state.currencyList).toEqual(mockCurrencies);
        done();
      });
    });
  });

  describe('logout', () => {
    it('should reset state to empty but preserve currency list', (done) => {
      // First set some state including currencies
      store.setAppState(mockAppState);

      // Then logout
      store.logout();

      store.appState$.subscribe((state) => {
        expect(state).toEqual({
          ...EMPTY_APP_STATE,
          currencyList: mockCurrencies,
        });
        done();
      });
    });

    it('should preserve currency list even when empty', (done) => {
      const emptyCurrencies: Currency[] = [];

      // Set state with empty currencies
      store.setAppState({ ...mockAppState, currencyList: emptyCurrencies });

      // Then logout
      store.logout();

      store.appState$.subscribe((state) => {
        expect(state).toEqual({
          ...EMPTY_APP_STATE,
          currencyList: emptyCurrencies,
        });
        done();
      });
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      store.setAppState(mockAppState);
    });

    it('should select userId', (done) => {
      store.userId.subscribe((userId) => {
        expect(userId).toBe(1);
        done();
      });
    });

    it('should select userName', (done) => {
      store.userName$.subscribe((firstName) => {
        expect(firstName).toBe('John');
        done();
      });
    });

    it('should select userDefaultCurrency', (done) => {
      store.userDefaultCurrency$.subscribe((currency) => {
        expect(currency).toEqual(mockCurrency);
        done();
      });
    });

    it('should select currencyList', (done) => {
      store.currencyList$.subscribe((currencies) => {
        expect(currencies).toEqual(mockCurrencies);
        done();
      });
    });
  });

  describe('selectors with null values', () => {
    it('should handle null userId', (done) => {
      store.userId.subscribe((userId) => {
        expect(userId).toBeNull();
        done();
      });
    });

    it('should handle null firstName', (done) => {
      store.userName$.subscribe((firstName) => {
        expect(firstName).toBeNull();
        done();
      });
    });

    it('should handle null currency', (done) => {
      store.userDefaultCurrency$.subscribe((currency) => {
        expect(currency).toBeNull();
        done();
      });
    });
  });
});
