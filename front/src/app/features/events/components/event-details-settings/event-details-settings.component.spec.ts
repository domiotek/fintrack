import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailsSettingsComponent } from './event-details-settings.component';
import { EventDetails } from '../../../../core/models/events/event';
import { Currency } from '../../../../core/models/currency/currency.model';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { mocked_currency, mocked_event } from '../../../../core/mocks/tests-mocks';

describe('EventDetailsSettingsComponent', () => {
  let component: EventDetailsSettingsComponent;
  let fixture: ComponentFixture<EventDetailsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
      imports: [EventDetailsSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailsSettingsComponent);
    component = fixture.componentInstance;

    const currency: Currency = mocked_currency;
    const event: EventDetails = mocked_event;

    fixture.componentRef.setInput('event', event);
    fixture.componentRef.setInput('userCurrency', currency);
    fixture.componentRef.setInput('userId', 1);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
