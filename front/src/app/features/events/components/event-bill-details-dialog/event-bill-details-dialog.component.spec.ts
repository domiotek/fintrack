import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventBillDetailsDialogComponent } from './event-bill-details-dialog.component';

describe('EventBillDetailsDialogComponent', () => {
  let component: EventBillDetailsDialogComponent;
  let fixture: ComponentFixture<EventBillDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventBillDetailsDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventBillDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
