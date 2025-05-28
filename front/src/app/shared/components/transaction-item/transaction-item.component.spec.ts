import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionItemComponent } from './transaction-item.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { AppStateStore } from '../../../core/store/app-state.store';

describe('TransactionItemComponent', () => {
  let component: TransactionItemComponent;
  let fixture: ComponentFixture<TransactionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection(), AppStateStore],
      imports: [TransactionItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionItemComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('transaction', {
      id: 1,
      name: 'Groceries at Supermarket',
      date: '2025-05-25',
      amount: 125.5,
      category: {
        id: 1,
        name: 'Food',
        color: '#4CAF50',
        limit: 500,
        spendLimit: 400,
      },
      userValue: 125.5,
      billValue: 125.5,
      currencyId: 2,
    });

    fixture.componentRef.setInput('showCategory', true);

    fixture.componentRef.setInput('userCurrency', {
      id: 2,
      name: 'Euro',
      code: 'EUR',
      rate: 1.1,
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
