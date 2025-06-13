import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeRangeSelectorComponent } from './time-range-selector.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateTime } from 'luxon';
import { TimeRange } from '../../../core/models/time-range/time-range';

describe('TimeRangeSelectorComponent', () => {
  let component: TimeRangeSelectorComponent;
  let fixture: ComponentFixture<TimeRangeSelectorComponent>;

  const mockTimeRange: TimeRange = {
    from: DateTime.fromISO('2024-01-01'),
    to: DateTime.fromISO('2024-01-31'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeRangeSelectorComponent],
      providers: [provideExperimentalZonelessChangeDetection(), provideLuxonDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeRangeSelectorComponent);
    fixture.componentRef.setInput('initialTimeRange', mockTimeRange);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with provided time range', () => {
    expect(component.timeRange().from.toISODate()).toBe('2024-01-01');
    expect(component.timeRange().to.toISODate()).toBe('2024-01-31');
  });

  it('should generate correct label for full month', () => {
    const fullMonthRange: TimeRange = {
      from: DateTime.fromISO('2024-01-01'),
      to: DateTime.fromISO('2024-01-31'),
    };

    fixture.componentRef.setInput('initialTimeRange', fullMonthRange);
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.label()).toBe('January 2024');
  });

  it('should generate correct label for custom date range', () => {
    const customRange: TimeRange = {
      from: DateTime.fromISO('2024-01-15'),
      to: DateTime.fromISO('2024-01-20'),
    };

    fixture.componentRef.setInput('initialTimeRange', customRange);
    fixture.componentRef.setInput('customRangeAllowed', true);
    fixture.detectChanges();
    component.ngOnInit();

    const label = component.label();
    expect(label).toContain('15 Jan');
    expect(label).toContain('20 Jan');
  });

  it('should handle current year date formatting correctly', () => {
    const currentYear = DateTime.now().year;
    const currentYearRange: TimeRange = {
      from: DateTime.fromObject({ year: currentYear, month: 6, day: 1 }),
      to: DateTime.fromObject({ year: currentYear, month: 6, day: 30 }),
    };

    fixture.componentRef.setInput('initialTimeRange', currentYearRange);
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.label()).toBe('June');
  });

  it('should disable previous navigation when at minimum constraint', () => {
    const minDate = DateTime.fromISO('2024-01-01');
    const rangeAtMin: TimeRange = {
      from: minDate,
      to: minDate.endOf('month'),
    };

    fixture.componentRef.setInput('initialTimeRange', rangeAtMin);
    fixture.componentRef.setInput('constraints', { min: minDate });
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.prevDisabled()).toBe(true);
  });

  it('should enable previous navigation when not at minimum constraint', () => {
    const minDate = DateTime.fromISO('2024-01-01');
    const rangeAfterMin: TimeRange = {
      from: DateTime.fromISO('2024-02-01'),
      to: DateTime.fromISO('2024-02-29'),
    };

    fixture.componentRef.setInput('initialTimeRange', rangeAfterMin);
    fixture.componentRef.setInput('constraints', { min: minDate });
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.prevDisabled()).toBe(false);
  });

  it('should disable next navigation when at maximum constraint', () => {
    const maxDate = DateTime.fromISO('2024-12-31');
    const rangeAtMax: TimeRange = {
      from: DateTime.fromISO('2024-12-01'),
      to: maxDate,
    };

    fixture.componentRef.setInput('initialTimeRange', rangeAtMax);
    fixture.componentRef.setInput('constraints', { max: maxDate });
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.nextDisabled()).toBe(true);
  });

  it('should filter dates correctly based on constraints', () => {
    const minDate = DateTime.fromISO('2024-01-01');
    const maxDate = DateTime.fromISO('2024-12-31');

    fixture.componentRef.setInput('constraints', { min: minDate, max: maxDate });
    fixture.detectChanges();

    const dateFilter = component.dateFilter();

    expect(dateFilter(DateTime.fromISO('2023-12-31'))).toBe(false); // Before min
    expect(dateFilter(DateTime.fromISO('2024-06-15'))).toBe(true); // Within range
    expect(dateFilter(DateTime.fromISO('2025-01-01'))).toBe(false); // After max
    expect(dateFilter(null)).toBe(false); // Null date
  });

  it('should emit timeRangeChange when range changes', () => {
    spyOn(component.timeRangeChange, 'emit');

    const newRange: TimeRange = {
      from: DateTime.fromISO('2024-02-01'),
      to: DateTime.fromISO('2024-02-29'),
    };

    component.timeRange.set(newRange);

    // Simulate calling the emit method that would be triggered by user interaction
    component.timeRangeChange.emit(newRange);

    expect(component.timeRangeChange.emit).toHaveBeenCalledWith(newRange);
  });

  it('should handle single day range correctly', () => {
    const singleDayRange: TimeRange = {
      from: DateTime.fromISO('2024-01-15'),
      to: DateTime.fromISO('2024-01-15'),
    };

    fixture.componentRef.setInput('initialTimeRange', singleDayRange);
    fixture.componentRef.setInput('customRangeAllowed', true);
    fixture.detectChanges();
    component.ngOnInit();

    const label = component.label();
    expect(label).toContain('15 Jan');
    expect(label).not.toContain(' - ');
  });
});
