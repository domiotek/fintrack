import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventBillsSummaryComponent } from './event-bills-summary.component';

describe('EventBillsSummaryComponent', () => {
  let component: EventBillsSummaryComponent;
  let fixture: ComponentFixture<EventBillsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventBillsSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventBillsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
