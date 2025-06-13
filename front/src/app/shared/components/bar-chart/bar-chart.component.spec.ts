import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartComponent } from './bar-chart.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { mocked_chartData } from '../../../core/mocks/tests-mocks';
import { SimpleChanges } from '@angular/core';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
      imports: [BarChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BarChartComponent);
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

  it('should have default color', () => {
    expect(component.color()).toEqual('rgba(25,55,109)');
  });

  it('should accept custom color', () => {
    fixture.componentRef.setInput('color', 'rgba(255,0,0)');
    fixture.detectChanges();

    expect(component.color()).toEqual('rgba(255,0,0)');
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
  it('should not regenerate chart when other properties change', () => {
    // Spy on generateChart before calling ngOnInit
    spyOn(component, 'generateChart');

    component.ngOnInit();

    const mockChart = { destroy: jasmine.createSpy('destroy') };
    component.chart = mockChart;

    const changes: SimpleChanges = {
      color: {
        currentValue: 'red',
        previousValue: 'blue',
        firstChange: false,
        isFirstChange: () => false,
      },
    };

    component.ngOnChanges(changes);

    expect(mockChart.destroy).not.toHaveBeenCalled();
    expect(component.generateChart).toHaveBeenCalledTimes(1); // Only once in ngOnInit
  });
});
