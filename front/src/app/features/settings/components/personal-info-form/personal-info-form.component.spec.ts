import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalInfoFormComponent } from './personal-info-form.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { SettingsService } from '../../../../core/services/settings/settings.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError, Subject } from 'rxjs';
import { ApiErrorCode } from '../../../../core/models/error-codes.enum';

describe('PersonalInfoFormComponent', () => {
  let component: PersonalInfoFormComponent;
  let fixture: ComponentFixture<PersonalInfoFormComponent>;
  let settingsService: jasmine.SpyObj<SettingsService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  beforeEach(async () => {
    const settingsServiceSpy = jasmine.createSpyObj('SettingsService', ['updateUserPersonalInfo', 'getErrorMessage']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [PersonalInfoFormComponent, NoopAnimationsModule],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: SettingsService, useValue: settingsServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        AppStateStore,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalInfoFormComponent);
    component = fixture.componentInstance;

    settingsService = TestBed.inject(SettingsService) as jasmine.SpyObj<SettingsService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    // Setup default service behaviors
    settingsService.getErrorMessage.and.returnValue('Generic error message');

    // Set default inputs
    fixture.componentRef.setInput('email', 'test@example.com');
    fixture.componentRef.setInput('currency', 1);
    component.firstName.set('John');
    component.lastName.set('Doe');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with input values', () => {
    expect(component.form.get('email')?.value).toBe('test@example.com');
    expect(component.form.get('firstName')?.value).toBe('John');
    expect(component.form.get('lastName')?.value).toBe('Doe');
    expect(component.form.get('currency')?.value).toBe(1);
  });

  it('should disable email field', () => {
    expect(component.form.get('email')?.disabled).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      component.form.patchValue({
        firstName: '',
        lastName: '',
        currency: null,
      });

      expect(component.form.get('firstName')?.hasError('required')).toBeTruthy();
      expect(component.form.get('lastName')?.hasError('required')).toBeTruthy();
      expect(component.form.get('currency')?.hasError('required')).toBeTruthy();
    });

    it('should validate minimum length for names', () => {
      component.form.patchValue({
        firstName: 'J',
        lastName: 'D',
      });

      expect(component.form.get('firstName')?.hasError('minlength')).toBeTruthy();
      expect(component.form.get('lastName')?.hasError('minlength')).toBeTruthy();
    });

    it('should validate email format', () => {
      // Enable email field temporarily for testing
      component.form.get('email')?.enable();
      component.form.get('email')?.setValue('invalid-email');

      expect(component.form.get('email')?.hasError('email')).toBeTruthy();

      component.form.get('email')?.setValue('valid@example.com');
      expect(component.form.get('email')?.valid).toBeTruthy();
    });

    it('should accept valid form data', () => {
      component.form.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        currency: 1,
      });

      expect(component.form.valid).toBeTruthy();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.form.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        currency: 1,
      });
    });

    it('should not submit invalid form', () => {
      component.form.get('firstName')?.setValue('');

      component.onSubmit();

      expect(settingsService.updateUserPersonalInfo).not.toHaveBeenCalled();
    });

    it('should submit valid form with correct parameters', () => {
      settingsService.updateUserPersonalInfo.and.returnValue(of(undefined));

      component.onSubmit();

      expect(settingsService.updateUserPersonalInfo).toHaveBeenCalledWith('John', 'Doe', 1);
    });
    it('should set submitting state during request', () => {
      // Create an observable that doesn't complete immediately to ensure submitting stays true
      const updateObservable = new Subject<void>();
      settingsService.updateUserPersonalInfo.and.returnValue(updateObservable);

      expect(component.submitting()).toBeFalsy();

      component.onSubmit();

      expect(component.submitting()).toBeTruthy();
    });

    it('should handle successful submission', () => {
      settingsService.updateUserPersonalInfo.and.returnValue(of(undefined));

      component.onSubmit();

      expect(component.submitting()).toBeFalsy();
      expect(snackBar.open).toHaveBeenCalledWith('Dane zostały zaktualizowane', 'Zamknij', { duration: 1200 });
      expect(component.firstName()).toBe('John');
      expect(component.lastName()).toBe('Doe');
    });

    it('should update model values on successful submission', () => {
      settingsService.updateUserPersonalInfo.and.returnValue(of(undefined));

      component.form.patchValue({
        firstName: 'Jane',
        lastName: 'Smith',
      });

      component.onSubmit();

      expect(component.firstName()).toBe('Jane');
      expect(component.lastName()).toBe('Smith');
    });

    it('should handle submission errors', () => {
      const errorResponse = {
        error: { code: ApiErrorCode.INVALID_USER },
      };
      settingsService.updateUserPersonalInfo.and.returnValue(throwError(() => errorResponse));

      component.onSubmit();

      expect(component.errorCode()).toBe(ApiErrorCode.INVALID_USER);
      expect(component.submitting()).toBeFalsy();
      expect(snackBar.open).not.toHaveBeenCalled();
    });

    it('should clear error code before new submission', () => {
      component.errorCode.set(ApiErrorCode.INVALID_USER);
      settingsService.updateUserPersonalInfo.and.returnValue(of(undefined));

      component.onSubmit();

      expect(component.errorCode()).toBeNull();
    });
  });

  describe('Component Lifecycle', () => {
    it('should patch form values on initialization', () => {
      // Create new component instance to test ngOnInit
      const newFixture = TestBed.createComponent(PersonalInfoFormComponent);
      const newComponent = newFixture.componentInstance;

      newFixture.componentRef.setInput('email', 'new@example.com');
      newFixture.componentRef.setInput('currency', 2);
      newComponent.firstName.set('Jane');
      newComponent.lastName.set('Smith');

      newComponent.ngOnInit();

      expect(newComponent.form.get('email')?.value).toBe('new@example.com');
      expect(newComponent.form.get('firstName')?.value).toBe('Jane');
      expect(newComponent.form.get('lastName')?.value).toBe('Smith');
      expect(newComponent.form.get('currency')?.value).toBe(2);
    });
  });

  describe('Error Handling', () => {
    it('should display error panel when error code is set', () => {
      component.errorCode.set(ApiErrorCode.INVALID_USER);
      fixture.detectChanges();

      const errorPanel = fixture.nativeElement.querySelector('app-alert-panel');
      expect(errorPanel).toBeTruthy();
    });

    it('should hide error panel when no error', () => {
      component.errorCode.set(null);
      fixture.detectChanges();

      const errorPanel = fixture.nativeElement.querySelector('app-alert-panel');
      expect(errorPanel).toBeFalsy();
    });
  });

  describe('Form Progress', () => {
    it('should show progress bar when submitting', () => {
      component.submitting.set(true);
      fixture.detectChanges();

      const progressBar = fixture.nativeElement.querySelector('app-form-progress-bar');
      expect(progressBar).toBeTruthy();
    });

    it('should disable submit button when submitting', () => {
      component.submitting.set(true);
      fixture.detectChanges();

      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton?.disabled).toBeTruthy();
    });

    it('should enable submit button when not submitting', () => {
      component.submitting.set(false);
      fixture.detectChanges();

      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton?.disabled).toBeFalsy();
    });
  });
});
