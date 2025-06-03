import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailsSettingsComponent } from './event-details-settings.component';

describe('EventDetailsSettingsComponent', () => {
  let component: EventDetailsSettingsComponent;
  let fixture: ComponentFixture<EventDetailsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDetailsSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
