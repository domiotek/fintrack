import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AppStateStore } from '../../../core/store/app-state.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Currency } from '../../../core/models/currency/currency.model';
import { ControlValueAccessor, FormControl, ReactiveFormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-currency-selector',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './currency-selector.component.html',
  styleUrl: './currency-selector.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CurrencySelectorComponent,
      multi: true,
    },
  ],
})
export class CurrencySelectorComponent implements OnInit, ControlValueAccessor {
  label = input('Wybierz walutę');

  internalControl = new FormControl('');
  private readonly appStateStore = inject(AppStateStore);
  destroyRef = inject(DestroyRef);

  currencies: Currency[] = [];
  disabled = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.internalControl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.internalControl.disable();
    } else {
      this.internalControl.enable();
    }
  }

  ngOnInit(): void {
    this.appStateStore.currencyList$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((currencies) => {
      this.currencies = currencies;
    });

    this.internalControl.valueChanges.subscribe((value) => {
      this.onChange(value);
      this.onTouched();
    });
  }
}
