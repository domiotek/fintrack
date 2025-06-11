import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLimitDialogComponent } from './manage-limit-dialog.component';

describe('ManageLimitDialogComponent', () => {
  let component: ManageLimitDialogComponent;
  let fixture: ComponentFixture<ManageLimitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageLimitDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageLimitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
