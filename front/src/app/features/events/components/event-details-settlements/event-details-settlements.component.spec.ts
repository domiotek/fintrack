import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailsSettlementsComponent } from './event-details-settlements.component';

describe('EventDetailsSettlementsComponent', () => {
  let component: EventDetailsSettlementsComponent;
  let fixture: ComponentFixture<EventDetailsSettlementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDetailsSettlementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventDetailsSettlementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
