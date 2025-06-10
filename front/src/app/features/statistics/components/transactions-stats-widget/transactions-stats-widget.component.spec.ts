import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsStatsWidgetComponent } from './transactions-stats-widget.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppStateStore } from '../../../../core/store/app-state.store';

describe('TransactionsStatsWidgetComponent', () => {
  let component: TransactionsStatsWidgetComponent;
  let fixture: ComponentFixture<TransactionsStatsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        AppStateStore,
      ],
      imports: [TransactionsStatsWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsStatsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
