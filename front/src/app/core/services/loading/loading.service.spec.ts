import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
    });
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with loading state as false', () => {
    const loadingState = service.getLoadingState();
    expect(loadingState()).toBe(false);
  });

  it('should set loading to true when setLoading(true) is called', () => {
    service.setLoading(true);
    const loadingState = service.getLoadingState();
    expect(loadingState()).toBe(true);
  });

  it('should set loading to false when setLoading(false) is called', () => {
    service.setLoading(true);
    service.setLoading(false);
    const loadingState = service.getLoadingState();
    expect(loadingState()).toBe(false);
  });

  it('should handle multiple loading states correctly with counter', () => {
    const loadingState = service.getLoadingState();

    // Start with false
    expect(loadingState()).toBe(false);

    // Set loading true twice
    service.setLoading(true);
    expect(loadingState()).toBe(true);

    service.setLoading(true);
    expect(loadingState()).toBe(true);

    // Set loading false once - should still be true
    service.setLoading(false);
    expect(loadingState()).toBe(true);

    // Set loading false again - should now be false
    service.setLoading(false);
    expect(loadingState()).toBe(false);
  });

  it('should never go below zero when setting loading false multiple times', () => {
    const loadingState = service.getLoadingState();

    // Set false multiple times
    service.setLoading(false);
    service.setLoading(false);
    service.setLoading(false);
    expect(loadingState()).toBe(false);

    // Set true once
    service.setLoading(true);
    expect(loadingState()).toBe(true);

    // Set false once - should be false
    service.setLoading(false);
    expect(loadingState()).toBe(false);
  });

  it('should handle complex loading scenarios', () => {
    const loadingState = service.getLoadingState();

    // Simulate multiple concurrent operations
    service.setLoading(true); // Operation 1 starts
    service.setLoading(true); // Operation 2 starts
    service.setLoading(true); // Operation 3 starts
    expect(loadingState()).toBe(true);

    service.setLoading(false); // Operation 1 finishes
    expect(loadingState()).toBe(true); // Still loading

    service.setLoading(false); // Operation 2 finishes
    expect(loadingState()).toBe(true); // Still loading

    service.setLoading(false); // Operation 3 finishes
    expect(loadingState()).toBe(false); // All operations finished
  });
});
