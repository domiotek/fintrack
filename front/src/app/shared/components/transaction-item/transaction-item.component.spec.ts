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
  it('should display transaction name', () => {
    const nameElement = fixture.nativeElement.querySelector('.info_top .bold');
    expect(nameElement?.textContent).toContain('Groceries at Supermarket');
  });
  it('should display transaction amount', () => {
    const amountElement = fixture.nativeElement.querySelector('.main_amount');
    expect(amountElement?.textContent).toContain('125.5');
  });

  it('should display transaction date', () => {
    expect(component.transaction().date).toBe('2025-05-25');
  });

  it('should display category information', () => {
    const category = component.transaction().category;
    expect(category.name).toBe('Food');
    expect(category.color).toBe('#4CAF50');
  });

  it('should handle different transaction amounts', () => {
    fixture.componentRef.setInput('transaction', {
      ...component.transaction(),
      amount: 250.75,
    });

    expect(component.transaction().amount).toBe(250.75);
  });

  it('should handle different categories', () => {
    const newCategory = {
      id: 2,
      name: 'Transportation',
      color: '#FF5722',
      limit: 300,
      spendLimit: 200,
    };

    fixture.componentRef.setInput('transaction', {
      ...component.transaction(),
      category: newCategory,
    });

    expect(component.transaction().category.name).toBe('Transportation');
    expect(component.transaction().category.color).toBe('#FF5722');
  });
});
