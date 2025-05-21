import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AppStateStore } from '../../../core/store/app-state.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Currency } from '../../../core/models/currency/currency.model';
import { FormControl, ReactiveFormsModule, NG_VALUE_ACCESSOR, FormGroup } from '@angular/forms';
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
export class CurrencySelectorComponent implements OnInit {
  label = input('Wybierz walutę');
  inputName = input('currency');
  parentForm = input<FormGroup>();

  private readonly appStateStore = inject(AppStateStore);
  destroyRef = inject(DestroyRef);

  currencies: Currency[] = [];

  get formControl() {
    return this.parentForm()?.get(this.inputName() ?? '') as FormControl;
  }

  ngOnInit(): void {
    this.appStateStore.currencyList$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((currencies) => {
      this.currencies = currencies;
    });
  }
}
