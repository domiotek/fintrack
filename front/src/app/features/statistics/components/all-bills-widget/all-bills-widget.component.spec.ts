import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllBillsWidgetComponent } from './all-bills-widget.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppStateStore } from '../../../../core/store/app-state.store';

describe('AllBillsWidgetComponent', () => {
  let component: AllBillsWidgetComponent;
  let fixture: ComponentFixture<AllBillsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        AppStateStore,
      ],
      imports: [AllBillsWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AllBillsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
