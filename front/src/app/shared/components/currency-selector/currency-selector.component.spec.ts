import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencySelectorComponent } from './currency-selector.component';
import { provideExperimentalZonelessChangeDetection, signal } from '@angular/core';
import { AppStateStore } from '../../../core/store/app-state.store';
import { FormControl, FormGroup } from '@angular/forms';
import { Currency } from '../../../core/models/currency/currency.model';
import { BehaviorSubject } from 'rxjs';

describe('CurrencySelectorComponent', () => {
  let component: CurrencySelectorComponent;
  let fixture: ComponentFixture<CurrencySelectorComponent>;
  let mockAppStateStore: jasmine.SpyObj<AppStateStore>;

  const mockCurrencies: Currency[] = [
    { id: 1, name: 'Polish Zloty', code: 'PLN', rate: 1 },
    { id: 2, name: 'US Dollar', code: 'USD', rate: 4.5 },
    { id: 3, name: 'Euro', code: 'EUR', rate: 4.8 },
  ];

  beforeEach(async () => {
    const currencyListSubject = new BehaviorSubject<Currency[]>(mockCurrencies);

    mockAppStateStore = jasmine.createSpyObj('AppStateStore', [], {
      currencyList$: currencyListSubject.asObservable(),
    });

    await TestBed.configureTestingModule({
      imports: [CurrencySelectorComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: AppStateStore, useValue: mockAppStateStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrencySelectorComponent);
    component = fixture.componentInstance;

    component.parentForm = signal(new FormGroup({ currency: new FormControl() })) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default label', () => {
    const labelElement = fixture.nativeElement.querySelector('mat-label');
    expect(labelElement?.textContent?.trim()).toBe('Wybierz walutę');
  });

  it('should display custom label when provided', () => {
    fixture.componentRef.setInput('label', 'Custom Currency Label');
    fixture.detectChanges();

    const labelElement = fixture.nativeElement.querySelector('mat-label');
    expect(labelElement?.textContent?.trim()).toBe('Custom Currency Label');
  });

  it('should load currencies from store on init', () => {
    component.ngOnInit();
    expect(component.currencies).toEqual(mockCurrencies);
  });

  it('should display currency options', async () => {
    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();

    const matSelect = fixture.nativeElement.querySelector('mat-select');
    matSelect.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const options = document.querySelectorAll('mat-option');
    expect(options.length).toBe(3);
    expect(options[0].textContent?.trim()).toBe('Polish Zloty (PLN)');
    expect(options[1].textContent?.trim()).toBe('US Dollar (USD)');
    expect(options[2].textContent?.trim()).toBe('Euro (EUR)');
  });
  it('should get correct form control from parent form', () => {
    const testControl = new FormControl('test-value');
    const testForm = new FormGroup({ currency: testControl });
    component.parentForm = signal(testForm) as any;

    expect(component.formControl).toBe(testControl);
  });

  it('should get form control with custom input name', () => {
    const testControl = new FormControl('test-value');
    const testForm = new FormGroup({ customCurrency: testControl });
    component.parentForm = signal(testForm) as any;
    fixture.componentRef.setInput('inputName', 'customCurrency');

    expect(component.formControl).toBe(testControl);
  });

  it('should return null when parent form is not set', () => {
    component.parentForm = signal(null) as any;
    expect(component.formControl).toBeNull();
  });

  it('should return null when control name does not exist in form', () => {
    const testForm = new FormGroup({ otherControl: new FormControl() });
    component.parentForm = signal(testForm) as any;
    fixture.componentRef.setInput('inputName', 'nonexistent');

    expect(component.formControl).toBeNull();
  });
  it('should show validation error when field is required and empty', async () => {
    const testControl = new FormControl('', { validators: [] });
    testControl.setErrors({ required: true });
    testControl.markAsTouched(); // Mark as touched so error shows
    const testForm = new FormGroup({ currency: testControl });
    component.parentForm = signal(testForm) as any;

    fixture.detectChanges();
    await fixture.whenStable();

    const errorElement = fixture.nativeElement.querySelector('mat-error');
    expect(errorElement?.textContent?.trim()).toBe('Waluta jest wymagana');
  });

  it('should not show validation error when field has value', async () => {
    const testControl = new FormControl(1);
    const testForm = new FormGroup({ currency: testControl });
    component.parentForm = signal(testForm) as any;

    fixture.detectChanges();
    await fixture.whenStable();

    const errorElement = fixture.nativeElement.querySelector('mat-error');
    expect(errorElement).toBeFalsy();
  });

  it('should have correct input properties', () => {
    expect(component.label()).toBe('Wybierz walutę');
    expect(component.inputName()).toBe('currency');
  });
  it('should update input properties when changed', () => {
    // Create a form with both control names to handle the input name change
    const testForm = new FormGroup({
      currency: new FormControl(),
      newCurrency: new FormControl(),
    });
    component.parentForm = signal(testForm) as any;

    fixture.componentRef.setInput('label', 'New Label');
    fixture.componentRef.setInput('inputName', 'newCurrency');
    fixture.detectChanges();

    expect(component.label()).toBe('New Label');
    expect(component.inputName()).toBe('newCurrency');
  });
});
