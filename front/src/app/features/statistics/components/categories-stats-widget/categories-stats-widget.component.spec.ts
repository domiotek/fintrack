import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesStatsWidgetComponent } from './categories-stats-widget.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppStateStore } from '../../../../core/store/app-state.store';

describe('CategoriesStatsWidgetComponent', () => {
  let component: CategoriesStatsWidgetComponent;
  let fixture: ComponentFixture<CategoriesStatsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        AppStateStore,
      ],
      imports: [CategoriesStatsWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesStatsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
