import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCategoryDialogComponent } from './manage-category-dialog.component';

describe('ManageCategoryDialogComponent', () => {
  let component: ManageCategoryDialogComponent;
  let fixture: ComponentFixture<ManageCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCategoryDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
