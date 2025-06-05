import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventBillItemComponent } from './event-bill-item.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { EventBill } from '../../../../core/models/events/event-bill';
import { Currency } from '../../../../core/models/currency/currency.model';
import { mocked_bill, mocked_currency } from '../../../../core/mocks/tests-mocks';

describe('EventBillItemComponent', () => {
  let component: EventBillItemComponent;
  let fixture: ComponentFixture<EventBillItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
      imports: [EventBillItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventBillItemComponent);
    component = fixture.componentInstance;

    const bill: EventBill = mocked_bill;
    const currency: Currency = mocked_currency;

    fixture.componentRef.setInput('bill', bill);
    fixture.componentRef.setInput('userCurrency', currency);
    fixture.componentRef.setInput('billCurrency', currency);
    fixture.componentRef.setInput('isMobile', true);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
