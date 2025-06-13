import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProgressBarComponent } from './form-progress-bar.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('FormProgressBarComponent', () => {
  let component: FormProgressBarComponent;
  let fixture: ComponentFixture<FormProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormProgressBarComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(FormProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display progress bar when active is false', () => {
    fixture.componentRef.setInput('active', false);
    fixture.detectChanges();

    const progressBar = fixture.nativeElement.querySelector('mat-progress-bar');
    expect(progressBar).toBeFalsy();
  });

  it('should display progress bar when active is true', () => {
    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();

    const progressBar = fixture.nativeElement.querySelector('mat-progress-bar');
    expect(progressBar).toBeTruthy();
  });

  it('should have correct progress bar attributes when active', () => {
    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();

    const progressBar = fixture.nativeElement.querySelector('mat-progress-bar');
    expect(progressBar).toBeTruthy();
    expect(progressBar.getAttribute('mode')).toBe('indeterminate');
    expect(progressBar.classList.contains('progress-bar')).toBe(true);
  });

  it('should default to inactive state', () => {
    expect(component.active()).toBe(false);

    const progressBar = fixture.nativeElement.querySelector('mat-progress-bar');
    expect(progressBar).toBeFalsy();
  });

  it('should toggle progress bar visibility when active input changes', () => {
    // Initially inactive
    fixture.componentRef.setInput('active', false);
    fixture.detectChanges();

    let progressBar = fixture.nativeElement.querySelector('mat-progress-bar');
    expect(progressBar).toBeFalsy();

    // Set to active
    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();

    progressBar = fixture.nativeElement.querySelector('mat-progress-bar');
    expect(progressBar).toBeTruthy();

    // Set back to inactive
    fixture.componentRef.setInput('active', false);
    fixture.detectChanges();

    progressBar = fixture.nativeElement.querySelector('mat-progress-bar');
    expect(progressBar).toBeFalsy();
  });

  it('should have correct component input property', () => {
    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();

    expect(component.active()).toBe(true);
  });
});
