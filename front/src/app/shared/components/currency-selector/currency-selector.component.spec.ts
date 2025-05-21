import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencySelectorComponent } from './currency-selector.component';
import { provideExperimentalZonelessChangeDetection, signal } from '@angular/core';
import { AppStateStore } from '../../../core/store/app-state.store';
import { FormControl, FormGroup } from '@angular/forms';

describe('CurrencySelectorComponent', () => {
  let component: CurrencySelectorComponent;
  let fixture: ComponentFixture<CurrencySelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencySelectorComponent],
      providers: [provideExperimentalZonelessChangeDetection(), AppStateStore],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrencySelectorComponent);
    component = fixture.componentInstance;

    component.parentForm = signal(new FormGroup({ currency: new FormControl() })) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
