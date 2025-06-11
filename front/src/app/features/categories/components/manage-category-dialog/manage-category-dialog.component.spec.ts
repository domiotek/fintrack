import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCategoryDialogComponent } from './manage-category-dialog.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from '../../../../core/models/category/category.model';
import { mocked_category } from '../../../../core/mocks/tests-mocks';

describe('ManageCategoryDialogComponent', () => {
  let component: ManageCategoryDialogComponent;
  let fixture: ComponentFixture<ManageCategoryDialogComponent>;

  const data: Category = mocked_category;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
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
