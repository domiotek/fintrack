import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayOfWeekStatsWidgetComponent } from './day-of-week-stats-widget.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('DayOfWeekStatsWidgetComponent', () => {
  let component: DayOfWeekStatsWidgetComponent;
  let fixture: ComponentFixture<DayOfWeekStatsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
      imports: [DayOfWeekStatsWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DayOfWeekStatsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
