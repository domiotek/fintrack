import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventBillDialogComponent } from './add-event-bill-dialog.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { EventBillDialogData } from '../../models/add-event-bill-dialog-data';
import { Event } from '../../../../core/models/events/event';
import { Currency } from '../../../../core/models/currency/currency.model';
import { mocked_currency, mocked_event } from '../../../../core/mocks/tests-mocks';

describe('AddEventBillDialogComponent', () => {
  let component: AddEventBillDialogComponent;
  let fixture: ComponentFixture<AddEventBillDialogComponent>;

  const currency: Currency = mocked_currency;
  const event: Event = mocked_event;

  const data: EventBillDialogData = {
    event: event,
    eventCurrency: currency,
    userCurrency: currency,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: data },
        provideLuxonDateAdapter(),
      ],
      imports: [AddEventBillDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEventBillDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
