import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailsBillsComponent } from './event-details-bills.component';

describe('EventDetailsBillsComponent', () => {
  let component: EventDetailsBillsComponent;
  let fixture: ComponentFixture<EventDetailsBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDetailsBillsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventDetailsBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
