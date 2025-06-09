import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingSummaryWidgetComponent } from './spending-summary-widget.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppStateStore } from '../../../../core/store/app-state.store';

describe('SpendingSummaryWidgetComponent', () => {
  let component: SpendingSummaryWidgetComponent;
  let fixture: ComponentFixture<SpendingSummaryWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendingSummaryWidgetComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        AppStateStore,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SpendingSummaryWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
