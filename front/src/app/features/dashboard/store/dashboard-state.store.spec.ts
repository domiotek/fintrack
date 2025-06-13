import { TestBed } from '@angular/core/testing';
import { DashboardStateStore } from './dashboard-state.store';
import { EMPTY_DASHBOARD_STATE } from '../constants/empty-dasboard-state';
import { TimeRange } from '../../../core/models/time-range/time-range';
import { DateTime } from 'luxon';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('DashboardStateStore', () => {
  let store: DashboardStateStore;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection(), DashboardStateStore],
    });
    store = TestBed.inject(DashboardStateStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should initialize with empty dashboard state', (done) => {
    store.timeRange$.subscribe((timeRange) => {
      expect(timeRange).toEqual(EMPTY_DASHBOARD_STATE.timeRange);
      done();
    });
  });

  describe('setTimeRange', () => {
    it('should update time range', (done) => {
      const newTimeRange: TimeRange = {
        from: DateTime.fromISO('2024-01-01'),
        to: DateTime.fromISO('2024-01-31'),
      };

      store.setTimeRange(newTimeRange);

      store.timeRange$.subscribe((timeRange) => {
        expect(timeRange).toEqual(newTimeRange);
        done();
      });
    });

    it('should preserve other state when updating time range', (done) => {
      const newTimeRange: TimeRange = {
        from: DateTime.fromISO('2024-06-01'),
        to: DateTime.fromISO('2024-06-30'),
      };

      store.setTimeRange(newTimeRange);

      store
        .select((state) => state)
        .subscribe((state) => {
          expect(state.timeRange).toEqual(newTimeRange);
          done();
        });
    });
  });

  describe('refreshWidgets', () => {
    it('should emit refresh signal when refreshWidgets is called', (done) => {
      let refreshCount = 0;

      store.refresh$.subscribe(() => {
        refreshCount++;
        if (refreshCount === 1) {
          expect(refreshCount).toBe(1);
          done();
        }
      });

      store.refreshWidgets();
    });

    it('should emit multiple refresh signals for multiple calls', (done) => {
      let refreshCount = 0;
      const expectedCalls = 3;

      store.refresh$.subscribe(() => {
        refreshCount++;
        if (refreshCount === expectedCalls) {
          expect(refreshCount).toBe(expectedCalls);
          done();
        }
      });

      // Call refresh multiple times
      store.refreshWidgets();
      store.refreshWidgets();
      store.refreshWidgets();
    });
  });

  describe('state management', () => {
    it('should maintain state correctly through multiple operations', (done) => {
      const timeRange1: TimeRange = {
        from: DateTime.fromISO('2024-01-01'),
        to: DateTime.fromISO('2024-01-31'),
      };

      const timeRange2: TimeRange = {
        from: DateTime.fromISO('2024-02-01'),
        to: DateTime.fromISO('2024-02-28'),
      };

      // Set first time range
      store.setTimeRange(timeRange1);

      // Refresh widgets
      store.refreshWidgets();

      // Set second time range
      store.setTimeRange(timeRange2);

      store.timeRange$.subscribe((timeRange) => {
        expect(timeRange).toEqual(timeRange2);
        done();
      });
    });
  });
});
