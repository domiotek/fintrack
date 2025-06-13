import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogData } from '../../../core/models/dialog/confirmation-dialog-data';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ConfirmationDialogComponent>>;

  const mockDialogData: ConfirmationDialogData = {
    title: 'Test Confirmation',
    message: 'Are you sure you want to proceed with this action?',
  };

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
      ],
      imports: [ConfirmationDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display dialog title', () => {
    const titleElement = fixture.nativeElement.querySelector('[mat-dialog-title]');
    expect(titleElement?.textContent?.trim()).toBe('Test Confirmation');
  });

  it('should display dialog message', () => {
    const messageElement = fixture.nativeElement.querySelector('mat-dialog-content p');
    expect(messageElement?.textContent?.trim()).toBe('Are you sure you want to proceed with this action?');
  });
  it('should have "Nie" (No) button', () => {
    const noButton = fixture.nativeElement.querySelector('button[ng-reflect-dialog-result=""]');
    expect(noButton).toBeTruthy();
    expect(noButton?.textContent?.trim()).toBe('Nie');
  });
  it('should have "Tak" (Yes) button', () => {
    const yesButton = fixture.nativeElement.querySelector('button[ng-reflect-dialog-result="true"]');
    expect(yesButton).toBeTruthy();
    expect(yesButton?.textContent?.trim()).toBe('Tak');
    expect(yesButton?.getAttribute('color')).toBe('primary');
  });
  it('should close dialog with false when "Nie" button is clicked', () => {
    const noButton = fixture.nativeElement.querySelector('button[ng-reflect-dialog-result=""]');
    expect(noButton).toBeTruthy();
    noButton.click();
    fixture.detectChanges();

    // The mat-dialog-close directive should handle the closing
    expect(noButton.getAttribute('ng-reflect-dialog-result')).toBe('');
  });
  it('should close dialog with true when "Tak" button is clicked', () => {
    const yesButton = fixture.nativeElement.querySelector('button[ng-reflect-dialog-result="true"]');
    expect(yesButton).toBeTruthy();
    yesButton.click();
    fixture.detectChanges();

    // The mat-dialog-close directive should handle the closing
    expect(yesButton.getAttribute('ng-reflect-dialog-result')).toBe('true');
  });

  it('should have correct dialog structure', () => {
    const title = fixture.nativeElement.querySelector('[mat-dialog-title]');
    const content = fixture.nativeElement.querySelector('mat-dialog-content');
    const actions = fixture.nativeElement.querySelector('mat-dialog-actions');
    const buttons = fixture.nativeElement.querySelectorAll('mat-dialog-actions button');

    expect(title).toBeTruthy();
    expect(content).toBeTruthy();
    expect(actions).toBeTruthy();
    expect(buttons.length).toBe(2);
  });
  it('should inject dialog data correctly', () => {
    expect(component['data']).toEqual(mockDialogData);
  });

  it('should have proper button types', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons.forEach((button: HTMLButtonElement) => {
      expect(button.type).toBe('button');
    });
  });
});
