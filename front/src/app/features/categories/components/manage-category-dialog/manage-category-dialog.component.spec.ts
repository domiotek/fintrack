import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCategoryDialogComponent } from './manage-category-dialog.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from '../../../../core/models/category/category.model';
import { mocked_category } from '../../../../core/mocks/tests-mocks';
import { CategoryService } from '../../../../core/services/category/category.service';
import { of, throwError } from 'rxjs';
import { ApiErrorCode } from '../../../../core/models/error-codes.enum';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CategoryRequest } from '../../../../core/models/category/category-request';

describe('ManageCategoryDialogComponent', () => {
  let component: ManageCategoryDialogComponent;
  let fixture: ComponentFixture<ManageCategoryDialogComponent>;
  let mockCategoryService: jasmine.SpyObj<CategoryService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ManageCategoryDialogComponent>>;

  const data: Category = mocked_category;

  beforeEach(async () => {
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', [
      'createCategory',
      'updateCategory',
      'getErrorMessage',
    ]);
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
      imports: [ManageCategoryDialogComponent, NoopAnimationsModule],
    }).compileComponents();
    mockCategoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    mockDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<ManageCategoryDialogComponent>>;
    fixture = TestBed.createComponent(ManageCategoryDialogComponent);
    component = fixture.componentInstance;

    // Run initial change detection without checking for changes to avoid ExpressionChangedAfterItHasBeenCheckedError
    fixture.detectChanges();

    // Let any async operations complete
    await fixture.whenStable();

    // Run final change detection
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display edit title when data is provided', () => {
    expect(component.title()).toBe('Edytuj kategorię');

    const titleElement = fixture.nativeElement.querySelector('h2[mat-dialog-title]');
    expect(titleElement.textContent.trim()).toBe('Edytuj kategorię');
  });

  it('should display create title when no data is provided', () => {
    // Create component without data
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: null },
      ],
      imports: [ManageCategoryDialogComponent, NoopAnimationsModule],
    });

    const newFixture = TestBed.createComponent(ManageCategoryDialogComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    expect(newComponent.title()).toBe('Utwórz kategorię');
  });

  it('should initialize form with category data when editing', () => {
    expect(component.form.get('name')?.value).toBe(mocked_category.name);
    expect(component.form.get('color')?.value).toBe(mocked_category.color);
  });

  it('should display save button text when editing', () => {
    expect(component.submitText()).toBe('Zapisz');

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.textContent.trim()).toBe('Zapisz');
  });

  it('should display create button text when creating', () => {
    // Create component without data
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: null },
      ],
      imports: [ManageCategoryDialogComponent, NoopAnimationsModule],
    });

    const newFixture = TestBed.createComponent(ManageCategoryDialogComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    expect(newComponent.submitText()).toBe('Utwórz');
  });

  it('should have required form fields', () => {
    const nameControl = component.form.get('name');
    const colorControl = component.form.get('color');

    expect(nameControl?.hasError('required')).toBe(false); // Pre-filled with data
    expect(colorControl?.hasError('required')).toBe(false); // Pre-filled with data
  });

  it('should validate name minimum length', () => {
    const nameControl = component.form.get('name');
    nameControl?.setValue('ab'); // Less than 3 characters

    expect(nameControl?.hasError('minlength')).toBe(true);
  });

  it('should display name required error when name is empty', () => {
    const nameControl = component.form.get('name');
    nameControl?.setValue('');
    nameControl?.markAsTouched();
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('mat-error');
    expect(errorElement?.textContent.trim()).toBe('Nazwa jest wymagana');
  });

  it('should display name minlength error when name is too short', () => {
    const nameControl = component.form.get('name');
    nameControl?.setValue('ab');
    nameControl?.markAsTouched();
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('mat-error');
    expect(errorElement?.textContent.trim()).toBe('Nazwa nie może być krótsza niż 3 znaki.');
  });
  it('should display color picker with current color', () => {
    const colorPicker = fixture.nativeElement.querySelector('.color-picker');
    const colorInput = fixture.nativeElement.querySelector('.color-input');

    expect(colorPicker).toBeTruthy();
    expect(colorInput).toBeTruthy();
    expect(colorInput.value).toBe(mocked_category.color);
  });

  it('should show progress bar when submitting', () => {
    component.submitting.set(true);
    fixture.detectChanges();

    const progressBar = fixture.nativeElement.querySelector('app-form-progress-bar');
    expect(progressBar.getAttribute('ng-reflect-active')).toBe('true');
  });

  it('should hide progress bar when not submitting', () => {
    component.submitting.set(false);
    fixture.detectChanges();

    const progressBar = fixture.nativeElement.querySelector('app-form-progress-bar');
    expect(progressBar.getAttribute('ng-reflect-active')).toBe('false');
  });

  it('should disable submit button when form is invalid', () => {
    const nameControl = component.form.get('name');
    nameControl?.setValue(''); // Make form invalid
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBe(true);
  });

  it('should disable submit button when submitting', () => {
    component.submitting.set(true);
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBe(true);
  });

  it('should disable cancel button when submitting', () => {
    component.submitting.set(true);
    fixture.detectChanges();

    const cancelButton = fixture.nativeElement.querySelector('button[mat-dialog-close]');
    expect(cancelButton.disabled).toBe(true);
  });
  it('should display error message when error occurs', () => {
    const errorCode = ApiErrorCode.INTERNAL_SERVER_ERROR;
    mockCategoryService.getErrorMessage.and.returnValue('Server error message');
    component.errorCode.set(errorCode);
    fixture.detectChanges();

    const alertPanel = fixture.nativeElement.querySelector('app-alert-panel');
    expect(alertPanel).toBeTruthy();
    expect(alertPanel.getAttribute('severity')).toBe('error');
    expect(mockCategoryService.getErrorMessage).toHaveBeenCalledWith(errorCode);
  });

  it('should not display error message when no error', () => {
    component.errorCode.set(null);
    fixture.detectChanges();

    const alertPanel = fixture.nativeElement.querySelector('app-alert-panel');
    expect(alertPanel).toBeFalsy();
  });

  it('should call updateCategory when editing and form is submitted', () => {
    mockCategoryService.updateCategory.and.returnValue(of(undefined));
    component.form.patchValue({ name: 'Updated Name', color: '#ff0000' });

    component.onSubmit();

    const expectedRequest: CategoryRequest = {
      name: 'Updated Name',
      color: '#ff0000',
    };
    expect(mockCategoryService.updateCategory).toHaveBeenCalledWith(mocked_category.id, expectedRequest);
  });

  it('should close dialog with request data when update succeeds', () => {
    mockCategoryService.updateCategory.and.returnValue(of(undefined));
    component.form.patchValue({ name: 'Updated Name', color: '#ff0000' });

    component.onSubmit();

    const expectedRequest: CategoryRequest = {
      name: 'Updated Name',
      color: '#ff0000',
    };
    expect(mockDialogRef.close).toHaveBeenCalledWith(expectedRequest);
  });

  it('should handle update error and display error message', () => {
    const error = { error: { code: ApiErrorCode.INTERNAL_SERVER_ERROR } };
    mockCategoryService.updateCategory.and.returnValue(throwError(() => error));
    mockCategoryService.getErrorMessage.and.returnValue('Server error');

    component.onSubmit();

    expect(component.errorCode()).toBe(ApiErrorCode.INTERNAL_SERVER_ERROR);
    expect(component.submitting()).toBe(false);
  });
  it('should call createCategory when creating new category', () => {
    // Create component without data for testing creation
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: null },
      ],
      imports: [ManageCategoryDialogComponent, NoopAnimationsModule],
    });

    const newFixture = TestBed.createComponent(ManageCategoryDialogComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    mockCategoryService.createCategory.and.returnValue(of(undefined));
    newComponent.form.patchValue({ name: 'New Category', color: '#00ff00' });

    newComponent.onSubmit();

    const expectedRequest: CategoryRequest = {
      name: 'New Category',
      color: '#00ff00',
    };
    expect(mockCategoryService.createCategory).toHaveBeenCalledWith(expectedRequest);
  });

  it('should close dialog with true when create succeeds', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: null },
      ],
      imports: [ManageCategoryDialogComponent, NoopAnimationsModule],
    });

    const newFixture = TestBed.createComponent(ManageCategoryDialogComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    mockCategoryService.createCategory.and.returnValue(of(undefined));
    newComponent.form.patchValue({ name: 'New Category', color: '#00ff00' });

    newComponent.onSubmit();

    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should not submit when form is invalid', () => {
    component.form.patchValue({ name: '', color: null }); // Invalid form

    component.onSubmit();

    expect(mockCategoryService.updateCategory).not.toHaveBeenCalled();
    expect(mockCategoryService.createCategory).not.toHaveBeenCalled();
  });
  it('should update color picker background when color changes', () => {
    const newColor = '#ff00ff';

    // Set the value using patchValue to trigger valueChanges properly
    component.form.patchValue({ color: newColor });
    fixture.detectChanges();

    // Check that the form value and component color signal are set correctly
    expect(component.form.get('color')?.value).toBe(newColor);
    expect(component.colorValue()).toBe(newColor);
  });

  it('should have proper form field labels', () => {
    const nameLabel = fixture.nativeElement.querySelector('mat-label[for="name"]');
    const colorLabel = fixture.nativeElement.querySelector('.color-picker-container p');

    expect(nameLabel.textContent.trim()).toBe('Nazwa');
    expect(colorLabel.textContent.trim()).toBe('Wybierz kolor:');
  });
});
