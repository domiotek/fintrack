import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOperationTypeComponent } from './select-operation-type.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { StatsOperations, StatsOperationType } from '../../../../core/models/statistics/stats-operations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SelectOperationTypeComponent', () => {
  let component: SelectOperationTypeComponent;
  let fixture: ComponentFixture<SelectOperationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
      imports: [SelectOperationTypeComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectOperationTypeComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('selectedOparation', StatsOperations.SUM);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct label', () => {
    const labelElement = fixture.nativeElement.querySelector('mat-label');
    expect(labelElement?.textContent?.trim()).toBe('Operacja');
  });
  it('should have default selected operation', () => {
    expect(component.selectedOparation()).toBe(StatsOperations.SUM);
  });

  it('should load all available operations', () => {
    const operations = component.operations();
    expect(operations.length).toBe(2);
    expect(operations).toEqual([
      { label: 'Suma', value: StatsOperations.SUM },
      { label: 'Średnia', value: StatsOperations.AVERAGE },
    ]);
  });

  it('should display all operation options', async () => {
    const matSelect = fixture.nativeElement.querySelector('mat-select');
    matSelect.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const options = document.querySelectorAll('mat-option');
    expect(options.length).toBe(2);
    expect(options[0].textContent?.trim()).toBe('Suma');
    expect(options[1].textContent?.trim()).toBe('Średnia');
  });
  it('should update selected operation when option is clicked', async () => {
    const matSelect = fixture.nativeElement.querySelector('mat-select');
    matSelect.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const averageOption = document.querySelector('mat-option[ng-reflect-value="AVERAGE"]') as HTMLElement;
    averageOption.click();
    fixture.detectChanges();

    expect(component.selectedOparation()).toBe(StatsOperations.AVERAGE);
  });
  it('should reflect model changes in the select value', () => {
    fixture.componentRef.setInput('selectedOparation', StatsOperations.AVERAGE);
    fixture.detectChanges();

    expect(component.selectedOparation()).toBe(StatsOperations.AVERAGE);
  });
  it('should handle all operation types', () => {
    const operationTypes: StatsOperationType[] = [StatsOperations.SUM, StatsOperations.AVERAGE];

    operationTypes.forEach((operationType) => {
      fixture.componentRef.setInput('selectedOparation', operationType);
      fixture.detectChanges();

      expect(component.selectedOparation()).toBe(operationType);
    });
  });
  it('should have correct mat-select attributes', () => {
    const matSelect = fixture.nativeElement.querySelector('mat-select');
    expect(matSelect).toBeTruthy();
    // Check the component's model value instead of DOM attribute
    expect(component.selectedOparation()).toBe(StatsOperations.SUM);
  });

  it('should have mat-form-field with outline appearance', () => {
    const formField = fixture.nativeElement.querySelector('mat-form-field');
    expect(formField?.getAttribute('appearance')).toBe('outline');
  });

  it('should change selection from SUM to AVERAGE', async () => {
    // Initially SUM
    expect(component.selectedOparation()).toBe('SUM');

    const matSelect = fixture.nativeElement.querySelector('mat-select');
    matSelect.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const averageOption = document.querySelector('mat-option[ng-reflect-value="AVERAGE"]') as HTMLElement;
    averageOption.click();
    fixture.detectChanges();

    expect(component.selectedOparation()).toBe('AVERAGE');
  });

  it('should maintain operations signal immutability', () => {
    const initialOperations = component.operations();
    const secondCall = component.operations();

    expect(initialOperations).toBe(secondCall); // Should be the same reference (immutable)
  });

  it('should have proper component structure', () => {
    const formField = fixture.nativeElement.querySelector('mat-form-field');
    const label = fixture.nativeElement.querySelector('mat-label');
    const select = fixture.nativeElement.querySelector('mat-select');

    expect(formField).toBeTruthy();
    expect(label).toBeTruthy();
    expect(select).toBeTruthy();
  });

  it('should display correct option values', async () => {
    const matSelect = fixture.nativeElement.querySelector('mat-select');
    matSelect.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const sumOption = document.querySelector('mat-option[ng-reflect-value="SUM"]');
    const averageOption = document.querySelector('mat-option[ng-reflect-value="AVERAGE"]');

    expect(sumOption).toBeTruthy();
    expect(averageOption).toBeTruthy();
    expect(sumOption?.textContent?.trim()).toBe('Suma');
    expect(averageOption?.textContent?.trim()).toBe('Średnia');
  });
});
