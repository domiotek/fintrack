import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesStatsWidgetComponent } from './expenses-stats-widget.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppStateStore } from '../../../../core/store/app-state.store';

describe('ExpensesStatsWidgetComponent', () => {
  let component: ExpensesStatsWidgetComponent;
  let fixture: ComponentFixture<ExpensesStatsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        AppStateStore,
      ],
      imports: [ExpensesStatsWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpensesStatsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
