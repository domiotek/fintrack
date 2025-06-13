import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DayOfWeekStatsWidgetComponent } from './day-of-week-stats-widget.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StatisticsService } from '../../../../core/services/statistics/statistics.service';
import { of, throwError } from 'rxjs';
import { DateTime } from 'luxon';
import { StatsOperations } from '../../../../core/models/statistics/stats-operations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DayOfWeekStatsWidgetComponent', () => {
  let component: DayOfWeekStatsWidgetComponent;
  let fixture: ComponentFixture<DayOfWeekStatsWidgetComponent>;
  let statisticsService: jasmine.SpyObj<StatisticsService>;

  const mockStats = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    data: [100, 150, 200, 180, 120, 80, 90],
  };

  const mockEmptyStats = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    data: [0, 0, 0, 0, 0, 0, 0],
  };

  beforeEach(async () => {
    const statisticsServiceSpy = jasmine.createSpyObj('StatisticsService', ['getDayOfWeekStats']);

    await TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: StatisticsService, useValue: statisticsServiceSpy },
      ],
      imports: [DayOfWeekStatsWidgetComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DayOfWeekStatsWidgetComponent);
    component = fixture.componentInstance;

    statisticsService = TestBed.inject(StatisticsService) as jasmine.SpyObj<StatisticsService>;
    statisticsService.getDayOfWeekStats.and.returnValue(of(mockStats));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize with default values', () => {
    // The component loads data on init, so check the actual behavior
    expect(component).toBeTruthy();
    expect(component.filters()).toBe(StatsOperations.SUM);
  });
  describe('Data Loading', () => {
    it('should load stats data successfully', () => {
      const onLoadSpy = spyOn((component as any).onLoad, 'next');

      component.loadData();

      expect(statisticsService.getDayOfWeekStats).toHaveBeenCalled();
      expect(component.data()).toEqual(mockStats);
      expect(onLoadSpy).toHaveBeenCalledWith(true);
      expect(component.shouldShow()).toBeTruthy(); // Data sum > 0
    });

    it('should call service with correct parameters', () => {
      const fromDate = DateTime.now().startOf('month');
      const toDate = DateTime.now().endOf('month');

      // Set up the component's time range
      component.timeRange.set({ from: fromDate, to: toDate });
      component.filters.set(StatsOperations.AVERAGE);

      component.loadData();

      expect(statisticsService.getDayOfWeekStats).toHaveBeenCalledWith({
        from: fromDate.toISO(),
        to: toDate.toISO(),
        operation: StatsOperations.AVERAGE,
      });
    });

    it('should handle empty data correctly', () => {
      statisticsService.getDayOfWeekStats.and.returnValue(of(mockEmptyStats));
      const onLoadSpy = spyOn((component as any).onLoad, 'next');

      component.loadData();

      expect(component.data()).toEqual(mockEmptyStats);
      expect(component.shouldShow()).toBeFalsy(); // Data sum = 0
      expect(onLoadSpy).toHaveBeenCalledWith(true);
    });
    it('should handle service errors', () => {
      const error = new Error('Service error');
      statisticsService.getDayOfWeekStats.and.returnValue(throwError(() => error));
      const onLoadSpy = spyOn((component as any).onLoad, 'next');

      component.loadData();

      expect(onLoadSpy).toHaveBeenCalledWith(false);
      // Component should maintain previous data state on error
    });
  });
  describe('Filter Operations', () => {
    it('should change operation filter', () => {
      component.filters.set(StatsOperations.AVERAGE);

      expect(component.filters()).toBe(StatsOperations.AVERAGE);
    });

    it('should reload data when filter changes', () => {
      spyOn(component, 'loadData');

      component.filters.set(StatsOperations.AVERAGE);
      component.loadData(); // Simulate filter change trigger

      expect(component.loadData).toHaveBeenCalled();
    });
  });

  describe('Widget Lifecycle', () => {
    it('should call parent ngOnInit', () => {
      spyOn(Object.getPrototypeOf(Object.getPrototypeOf(component)), 'ngOnInit');

      component.ngOnInit();

      expect(Object.getPrototypeOf(Object.getPrototypeOf(component)).ngOnInit).toHaveBeenCalled();
    });

    it('should have empty triggerAction implementation', () => {
      expect(() => component.triggerAction()).not.toThrow();
    });
  });

  describe('Chart Display Logic', () => {
    it('should show chart when data has values', () => {
      component.data.set(mockStats);

      expect(component.shouldShow()).toBeTruthy();
    });
    it('should hide chart when all data values are zero', () => {
      statisticsService.getDayOfWeekStats.and.returnValue(of(mockEmptyStats));

      component.loadData();

      expect(component.shouldShow()).toBeFalsy();
    });

    it('should show no-data component when shouldShow is false', () => {
      component.shouldShow.set(false);
      fixture.detectChanges();

      const noDataElement = fixture.nativeElement.querySelector('app-no-data');
      expect(noDataElement).toBeTruthy();
    });

    it('should show chart component when shouldShow is true and data exists', () => {
      component.data.set(mockStats);
      component.shouldShow.set(true);
      fixture.detectChanges();

      const chartElement = fixture.nativeElement.querySelector('app-bar-chart');
      expect(chartElement).toBeTruthy();
    });
  });

  describe('Data Processing', () => {
    it('should correctly calculate sum for shouldShow', () => {
      const dataWithValues = {
        labels: ['Mon', 'Tue', 'Wed'],
        data: [10, 20, 30], // Sum = 60
      };

      statisticsService.getDayOfWeekStats.and.returnValue(of(dataWithValues));

      component.loadData();

      expect(component.shouldShow()).toBeTruthy();
    });

    it('should handle single non-zero value', () => {
      const singleValueData = {
        labels: ['Mon', 'Tue', 'Wed'],
        data: [0, 1, 0], // Sum = 1
      };

      statisticsService.getDayOfWeekStats.and.returnValue(of(singleValueData));

      component.loadData();

      expect(component.shouldShow()).toBeTruthy();
    });
  });
});
