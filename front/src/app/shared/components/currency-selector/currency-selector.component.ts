import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AppStateStore } from '../../../core/store/app-state.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Currency } from '../../../core/models/currency/currency.model';

@Component({
  selector: 'app-currency-selector',
  imports: [MatFormField, MatSelectModule],
  templateUrl: './currency-selector.component.html',
  styleUrl: './currency-selector.component.scss',
})
export class CurrencySelectorComponent implements OnInit {
  label = Input('Wybierz walutę');
  formControl = Input();

  private readonly appStateStore = inject(AppStateStore);
  destroyRef = inject(DestroyRef);

  currencies: Currency[] = [];

  ngOnInit(): void {
    this.appStateStore.currencyList$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((currencies) => {
      this.currencies = currencies;
    });
  }
}
