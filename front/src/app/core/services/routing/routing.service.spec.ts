import { TestBed } from '@angular/core/testing';

import { RoutingService } from './routing.service';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { Router } from '@angular/router';

describe('RoutingService', () => {
  let service: RoutingService;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection(), { provide: Router, useValue: mockRouter }],
    });
    service = TestBed.inject(RoutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('navigate', () => {
    it('should call router.navigate with correct URL and empty state when no state provided', () => {
      const url = ['/test', 'path'];

      service.navigate(url);

      expect(mockRouter.navigate).toHaveBeenCalledWith(url, { state: {} });
    });

    it('should call router.navigate with provided state', () => {
      const url = ['/test', 'path'];
      const state = { userId: 123, ref: 'dashboard' };

      service.navigate(url, state);

      expect(mockRouter.navigate).toHaveBeenCalledWith(url, { state });
    });

    it('should store navigation state for later retrieval', () => {
      const url = ['/test'];
      const state = { data: 'test', id: 456 };

      service.navigate(url, state);

      const retrievedState = service.getAndConsumeNavigationState();
      expect(retrievedState).toEqual(state);
    });

    it('should handle undefined state as empty object', () => {
      const url = ['/test'];

      service.navigate(url, undefined);

      expect(mockRouter.navigate).toHaveBeenCalledWith(url, { state: {} });
    });

    it('should overwrite previous navigation state', () => {
      const url = ['/test'];
      const firstState = { first: true };
      const secondState = { second: true };

      service.navigate(url, firstState);
      service.navigate(url, secondState);

      const retrievedState = service.getAndConsumeNavigationState();
      expect(retrievedState).toEqual(secondState);
      expect(retrievedState).not.toEqual(firstState);
    });
  });

  describe('getAndConsumeNavigationState', () => {
    it('should return empty object when no navigation has occurred', () => {
      const state = service.getAndConsumeNavigationState();
      expect(state).toEqual({});
    });

    it('should return stored navigation state', () => {
      const url = ['/test'];
      const expectedState = { message: 'success', userId: 789 };

      service.navigate(url, expectedState);
      const retrievedState = service.getAndConsumeNavigationState();

      expect(retrievedState).toEqual(expectedState);
    });

    it('should clear navigation state after consumption', () => {
      const url = ['/test'];
      const state = { temp: 'data' };

      service.navigate(url, state);

      // First call should return the state
      const firstRetrieval = service.getAndConsumeNavigationState();
      expect(firstRetrieval).toEqual(state);

      // Second call should return empty object
      const secondRetrieval = service.getAndConsumeNavigationState();
      expect(secondRetrieval).toEqual({});
    });

    it('should handle multiple navigations and consumptions correctly', () => {
      const url = ['/test'];

      // First navigation
      const firstState = { step: 1 };
      service.navigate(url, firstState);
      expect(service.getAndConsumeNavigationState()).toEqual(firstState);
      expect(service.getAndConsumeNavigationState()).toEqual({});

      // Second navigation
      const secondState = { step: 2 };
      service.navigate(url, secondState);
      expect(service.getAndConsumeNavigationState()).toEqual(secondState);
      expect(service.getAndConsumeNavigationState()).toEqual({});
    });

    it('should not affect router navigation when state is consumed', () => {
      const url = ['/test'];
      const state = { data: 'test' };

      service.navigate(url, state);
      service.getAndConsumeNavigationState();

      expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(url, { state });
    });
  });

  describe('state management edge cases', () => {
    it('should handle null state correctly', () => {
      const url = ['/test'];

      service.navigate(url, null as any);

      expect(mockRouter.navigate).toHaveBeenCalledWith(url, { state: {} });
      expect(service.getAndConsumeNavigationState()).toEqual({});
    });

    it('should handle complex state objects', () => {
      const url = ['/test'];
      const complexState = {
        user: { id: 1, name: 'John' },
        settings: { theme: 'dark', notifications: true },
        array: [1, 2, 3],
        nested: { deep: { value: 'test' } },
      };

      service.navigate(url, complexState);
      const retrievedState = service.getAndConsumeNavigationState();

      expect(retrievedState).toEqual(complexState);
    });

    it('should handle empty state object', () => {
      const url = ['/test'];
      const emptyState = {};

      service.navigate(url, emptyState);
      const retrievedState = service.getAndConsumeNavigationState();

      expect(retrievedState).toEqual(emptyState);
    });
  });
});
