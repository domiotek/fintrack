import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventBillItemComponent } from './event-bill-item.component';

describe('EventBillItemComponent', () => {
  let component: EventBillItemComponent;
  let fixture: ComponentFixture<EventBillItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventBillItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventBillItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
