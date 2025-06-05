import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailsSettlementsComponent } from './event-details-settlements.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EventDetails } from '../../../../core/models/events/event';
import { mocked_currency, mocked_event } from '../../../../core/mocks/tests-mocks';

describe('EventDetailsSettlementsComponent', () => {
  let component: EventDetailsSettlementsComponent;
  let fixture: ComponentFixture<EventDetailsSettlementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
      imports: [EventDetailsSettlementsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailsSettlementsComponent);
    component = fixture.componentInstance;

    const currency = mocked_currency;
    const event: EventDetails = mocked_event;

    fixture.componentRef.setInput('event', event);
    fixture.componentRef.setInput('userCurrency', currency);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
