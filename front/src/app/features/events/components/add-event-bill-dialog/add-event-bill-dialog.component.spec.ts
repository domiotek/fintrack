import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventBillDialogComponent } from './add-event-bill-dialog.component';

describe('AddEventBillDialogComponent', () => {
  let component: AddEventBillDialogComponent;
  let fixture: ComponentFixture<AddEventBillDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEventBillDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEventBillDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
