import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventBillsSummaryComponent } from './event-bills-summary.component';
import { EventSummary } from '../../../../core/models/events/event-summary';
import { Currency } from '../../../../core/models/currency/currency.model';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { mocked_currency, mocked_summary } from '../../../../core/mocks/tests-mocks';

describe('EventBillsSummaryComponent', () => {
  let component: EventBillsSummaryComponent;
  let fixture: ComponentFixture<EventBillsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
      imports: [EventBillsSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventBillsSummaryComponent);
    component = fixture.componentInstance;

    const currency: Currency = mocked_currency;
    const summary: EventSummary = mocked_summary;

    fixture.componentRef.setInput('summary', summary);
    fixture.componentRef.setInput('userCurrency', currency);
    fixture.componentRef.setInput('eventCurrency', currency);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
