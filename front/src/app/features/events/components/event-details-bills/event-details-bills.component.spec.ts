import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailsBillsComponent } from './event-details-bills.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EventDetails } from '../../../../core/models/events/event';
import { Currency } from '../../../../core/models/currency/currency.model';
import { mocked_currency, mocked_event } from '../../../../core/mocks/tests-mocks';

describe('EventDetailsBillsComponent', () => {
  let component: EventDetailsBillsComponent;
  let fixture: ComponentFixture<EventDetailsBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
      imports: [EventDetailsBillsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailsBillsComponent);
    component = fixture.componentInstance;

    const currency: Currency = mocked_currency;
    const event: EventDetails = mocked_event;

    fixture.componentRef.setInput('event', event);
    fixture.componentRef.setInput('userCurrency', currency);
    fixture.componentRef.setInput('isMobile', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
