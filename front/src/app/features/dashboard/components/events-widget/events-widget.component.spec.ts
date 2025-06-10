import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsWidgetComponent } from './events-widget.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { EventsService } from '../../../../core/services/events/events.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('EventsWidgetComponent', () => {
  let component: EventsWidgetComponent;
  let fixture: ComponentFixture<EventsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsWidgetComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        EventsService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
