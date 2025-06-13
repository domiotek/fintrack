import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerComponent } from './spinner.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
      imports: [SpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading message', () => {
    const messageElement = fixture.nativeElement.querySelector('h5');
    expect(messageElement?.textContent?.trim()).toBe('Jeszcze chwila...');
  });

  it('should display spinner with correct attributes', () => {
    const spinnerElement = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinnerElement).toBeTruthy();
    expect(spinnerElement.getAttribute('mode')).toBe('indeterminate');
  });

  it('should have proper component structure', () => {
    const loadingContainer = fixture.nativeElement.querySelector('.loadingState');
    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    const message = fixture.nativeElement.querySelector('h5');

    expect(loadingContainer).toBeTruthy();
    expect(spinner).toBeTruthy();
    expect(message).toBeTruthy();
  });

  it('should contain both spinner and message within loading container', () => {
    const loadingContainer = fixture.nativeElement.querySelector('.loadingState');
    const spinner = loadingContainer.querySelector('mat-spinner');
    const message = loadingContainer.querySelector('h5');

    expect(spinner).toBeTruthy();
    expect(message).toBeTruthy();
  });
});
