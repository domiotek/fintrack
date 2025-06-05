import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventItemComponent } from './event-item.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { Event } from '../../../../core/models/events/event';
import { mocked_event } from '../../../../core/mocks/tests-mocks';

describe('EventItemComponent', () => {
  let component: EventItemComponent;
  let fixture: ComponentFixture<EventItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
      imports: [EventItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventItemComponent);
    component = fixture.componentInstance;

    const event: Event = mocked_event;

    fixture.componentRef.setInput('event', event);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
