import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailsUsersComponent } from './event-details-users.component';
import { EventDetails } from '../../../../core/models/events/event';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { mocked_event } from '../../../../core/mocks/tests-mocks';

describe('EventDetailsUsersComponent', () => {
  let component: EventDetailsUsersComponent;
  let fixture: ComponentFixture<EventDetailsUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
      imports: [EventDetailsUsersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailsUsersComponent);
    component = fixture.componentInstance;

    const event: EventDetails = mocked_event;

    fixture.componentRef.setInput('event', event);
    fixture.componentRef.setInput('userId', 1);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
