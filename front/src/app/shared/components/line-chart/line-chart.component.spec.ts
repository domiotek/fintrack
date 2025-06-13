import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartComponent } from './line-chart.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { mocked_chartData } from '../../../core/mocks/tests-mocks';
import { SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js/auto';

describe('LineChartComponent', () => {
  let component: LineChartComponent;
  let fixture: ComponentFixture<LineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
      imports: [LineChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LineChartComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('chartData', mocked_chartData);
    fixture.componentRef.setInput('tooltipLabel', 'Test Tooltip');

    fixture.detectChanges();
  });

  afterEach(() => {
    if (component.chart) {
      component.chart.destroy();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have chart data input', () => {
    expect(component.chartData()).toEqual(mocked_chartData);
  });
  it('should have tooltip label input', () => {
    expect(component.tooltipLabel()).toEqual('Test Tooltip');
  });

  it('should initialize chart on ngOnInit', () => {
    spyOn(component, 'generateChart');
    component.ngOnInit();

    expect(component.generateChart).toHaveBeenCalled();
  });
  it('should regenerate chart when chartData changes', () => {
    // Spy on generateChart before calling ngOnInit
    spyOn(component, 'generateChart');

    // Initialize chart
    component.ngOnInit();

    // Mock chart for testing destruction
    const mockChart = { destroy: jasmine.createSpy('destroy') };
    component.chart = mockChart;

    const changes: SimpleChanges = {
      chartData: {
        currentValue: { labels: ['a', 'b'], data: [1, 2] },
        previousValue: mocked_chartData,
        firstChange: false,
        isFirstChange: () => false,
      },
    };

    component.ngOnChanges(changes);

    expect(mockChart.destroy).toHaveBeenCalled();
    expect(component.generateChart).toHaveBeenCalledTimes(2); // Once in ngOnInit, once in ngOnChanges
  });
  it('should not regenerate chart on first change', () => {
    // Spy on generateChart before calling ngOnInit
    spyOn(component, 'generateChart');

    component.ngOnInit();

    // Mock chart for testing destruction
    const mockChart = { destroy: jasmine.createSpy('destroy') };
    component.chart = mockChart;

    const changes: SimpleChanges = {
      chartData: {
        currentValue: { labels: ['a', 'b'], data: [1, 2] },
        previousValue: mocked_chartData,
        firstChange: true,
        isFirstChange: () => true,
      },
    };

    component.ngOnChanges(changes);

    expect(mockChart.destroy).not.toHaveBeenCalled();
    expect(component.generateChart).toHaveBeenCalledTimes(1); // Only once in ngOnInit
  });

  it('should not destroy chart if chart is not initialized', () => {
    const changes: SimpleChanges = {
      chartData: {
        currentValue: { labels: ['a', 'b'], data: [1, 2] },
        previousValue: mocked_chartData,
        firstChange: false,
        isFirstChange: () => false,
      },
    };

    expect(() => component.ngOnChanges(changes)).not.toThrow();
  });
});
