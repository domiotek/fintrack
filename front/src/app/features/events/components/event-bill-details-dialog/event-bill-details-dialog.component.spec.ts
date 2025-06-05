import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventBillDetailsDialogComponent } from './event-bill-details-dialog.component';
import { EventBillDetailsDialogData } from '../../models/event-bill-details-dialog-data';
import { Currency } from '../../../../core/models/currency/currency.model';
import { Event } from '../../../../core/models/events/event';
import { EventBill } from '../../../../core/models/events/event-bill';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { mocked_bill, mocked_event } from '../../../../core/mocks/tests-mocks';

describe('EventBillDetailsDialogComponent', () => {
  let component: EventBillDetailsDialogComponent;
  let fixture: ComponentFixture<EventBillDetailsDialogComponent>;

  const currency: Currency = {
    id: 1,
    name: 'test',
    code: 'USD',
    rate: 1.0,
  };

  const event: Event = mocked_event;
  const bill: EventBill = mocked_bill;

  const data: EventBillDetailsDialogData = {
    eventBill: bill,
    event: event,
    userCurrency: currency,
    eventCurrency: currency,
    userId: 1,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
      imports: [EventBillDetailsDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventBillDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
