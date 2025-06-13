import { callDebounced } from './debouncer';
import { DestroyRef } from '@angular/core';

describe('callDebounced', () => {
  let mockDestroyRef: jasmine.SpyObj<DestroyRef>;
  let destroyCallback: () => void;
  beforeEach(() => {
    mockDestroyRef = jasmine.createSpyObj('DestroyRef', ['onDestroy']);
    mockDestroyRef.onDestroy.and.callFake((callback: () => void) => {
      destroyCallback = callback;
      return () => {}; // DestroyRef.onDestroy returns a cleanup function
    });
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create a debounced function', () => {
    const mockFn = jasmine.createSpy('mockFn');
    const debouncedFn = callDebounced(mockFn, 100, mockDestroyRef);

    expect(debouncedFn).toBeDefined();
    expect(typeof debouncedFn).toBe('function');
  });

  it('should delay function execution by specified delay', () => {
    const mockFn = jasmine.createSpy('mockFn');
    const delay = 100;
    const debouncedFn = callDebounced(mockFn, delay, mockDestroyRef);

    debouncedFn('test', 123);

    // Function should not be called immediately
    expect(mockFn).not.toHaveBeenCalled();

    // Fast-forward time by less than delay
    jasmine.clock().tick(delay - 1);
    expect(mockFn).not.toHaveBeenCalled();

    // Fast-forward time to complete the delay
    jasmine.clock().tick(1);
    expect(mockFn).toHaveBeenCalledWith('test', 123);
  });

  it('should cancel previous timeout when called multiple times', () => {
    const mockFn = jasmine.createSpy('mockFn');
    const delay = 100;
    const debouncedFn = callDebounced(mockFn, delay, mockDestroyRef);

    // Call multiple times quickly
    debouncedFn('first');
    debouncedFn('second');
    debouncedFn('third');

    // Fast-forward time by delay
    jasmine.clock().tick(delay);

    // Only the last call should execute
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('third');
  });

  it('should handle multiple executions after delay', () => {
    const mockFn = jasmine.createSpy('mockFn');
    const delay = 100;
    const debouncedFn = callDebounced(mockFn, delay, mockDestroyRef);

    // First call
    debouncedFn('first');
    jasmine.clock().tick(delay);
    expect(mockFn).toHaveBeenCalledWith('first');

    // Second call after delay
    debouncedFn('second');
    jasmine.clock().tick(delay);
    expect(mockFn).toHaveBeenCalledWith('second');

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should clear timeout when component is destroyed', () => {
    const mockFn = jasmine.createSpy('mockFn');
    const delay = 100;
    const debouncedFn = callDebounced(mockFn, delay, mockDestroyRef);

    debouncedFn('test');

    // Trigger destroy before timeout completes
    destroyCallback();

    // Fast-forward time
    jasmine.clock().tick(delay);

    // Function should not be called
    expect(mockFn).not.toHaveBeenCalled();
  });

  it('should not execute if destroyed after timeout but before execution', () => {
    const mockFn = jasmine.createSpy('mockFn');
    const delay = 100;
    const debouncedFn = callDebounced(mockFn, delay, mockDestroyRef);

    debouncedFn('test');

    // Fast-forward time to just before execution
    jasmine.clock().tick(delay - 1);

    // Destroy the component
    destroyCallback();

    // Complete the timeout
    jasmine.clock().tick(1);

    // Function should not be called
    expect(mockFn).not.toHaveBeenCalled();
  });

  it('should not accept new calls after destruction', () => {
    const mockFn = jasmine.createSpy('mockFn');
    const delay = 100;
    const debouncedFn = callDebounced(mockFn, delay, mockDestroyRef);

    // Destroy first
    destroyCallback();

    // Try to call after destruction
    debouncedFn('test');
    jasmine.clock().tick(delay);

    // Function should not be called
    expect(mockFn).not.toHaveBeenCalled();
  });

  it('should handle functions with multiple parameters', () => {
    const mockFn = jasmine.createSpy('mockFn');
    const delay = 50;
    const debouncedFn = callDebounced(mockFn, delay, mockDestroyRef);

    debouncedFn('param1', 42, { key: 'value' }, [1, 2, 3]);
    jasmine.clock().tick(delay);

    expect(mockFn).toHaveBeenCalledWith('param1', 42, { key: 'value' }, [1, 2, 3]);
  });

  it('should handle functions with no parameters', () => {
    const mockFn = jasmine.createSpy('mockFn');
    const delay = 50;
    const debouncedFn = callDebounced(mockFn, delay, mockDestroyRef);

    debouncedFn();
    jasmine.clock().tick(delay);

    expect(mockFn).toHaveBeenCalledWith();
  });

  it('should handle zero delay', () => {
    const mockFn = jasmine.createSpy('mockFn');
    const debouncedFn = callDebounced(mockFn, 0, mockDestroyRef);

    debouncedFn('immediate');
    jasmine.clock().tick(0);

    expect(mockFn).toHaveBeenCalledWith('immediate');
  });

  it('should handle rapid successive calls correctly', () => {
    const mockFn = jasmine.createSpy('mockFn');
    const delay = 100;
    const debouncedFn = callDebounced(mockFn, delay, mockDestroyRef);

    // Make rapid calls
    for (let i = 0; i < 10; i++) {
      debouncedFn(`call-${i}`);
      jasmine.clock().tick(10); // Small tick between calls
    }

    // Wait for the final delay
    jasmine.clock().tick(delay);

    // Only the last call should execute
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('call-9');
  });

  it('should register destroy callback with destroyRef', () => {
    const mockFn = jasmine.createSpy('mockFn');
    callDebounced(mockFn, 100, mockDestroyRef);

    expect(mockDestroyRef.onDestroy).toHaveBeenCalledWith(jasmine.any(Function));
  });
});
