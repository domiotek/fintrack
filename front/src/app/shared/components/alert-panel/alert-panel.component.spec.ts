import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertPanelComponent } from './alert-panel.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { Component } from '@angular/core';

// Test host component for testing content projection
@Component({
  template: `<app-alert-panel [severity]="severity">{{ message }}</app-alert-panel>`,
  imports: [AlertPanelComponent],
})
class TestHostComponent {
  severity: 'info' | 'error' | 'warning' | 'success' = 'info';
  message = 'Test message content';
}

describe('AlertPanelComponent', () => {
  let component: AlertPanelComponent;
  let fixture: ComponentFixture<AlertPanelComponent>;
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertPanelComponent, TestHostComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default severity as info', () => {
    expect(component.severity()).toBe('info');
  });

  it('should display info icon for info severity', () => {
    fixture.componentRef.setInput('severity', 'info');
    fixture.detectChanges();

    expect(component.icon).toBe('info');
    const iconElement = fixture.nativeElement.querySelector('mat-icon');
    expect(iconElement?.textContent?.trim()).toBe('info');
  });

  it('should display error icon for error severity', () => {
    fixture.componentRef.setInput('severity', 'error');
    fixture.detectChanges();

    expect(component.icon).toBe('error');
    const iconElement = fixture.nativeElement.querySelector('mat-icon');
    expect(iconElement?.textContent?.trim()).toBe('error');
  });

  it('should display warning icon for warning severity', () => {
    fixture.componentRef.setInput('severity', 'warning');
    fixture.detectChanges();

    expect(component.icon).toBe('warning');
    const iconElement = fixture.nativeElement.querySelector('mat-icon');
    expect(iconElement?.textContent?.trim()).toBe('warning');
  });

  it('should display success icon for success severity', () => {
    fixture.componentRef.setInput('severity', 'success');
    fixture.detectChanges();

    expect(component.icon).toBe('check_circle');
    const iconElement = fixture.nativeElement.querySelector('mat-icon');
    expect(iconElement?.textContent?.trim()).toBe('check_circle');
  });

  it('should apply correct CSS class for severity', () => {
    fixture.componentRef.setInput('severity', 'error');
    fixture.detectChanges();

    const messageElement = fixture.nativeElement.querySelector('.message');
    expect(messageElement?.classList.contains('error')).toBe(true);
  });

  it('should change CSS class when severity changes', () => {
    fixture.componentRef.setInput('severity', 'info');
    fixture.detectChanges();

    let messageElement = fixture.nativeElement.querySelector('.message');
    expect(messageElement?.classList.contains('info')).toBe(true);

    fixture.componentRef.setInput('severity', 'warning');
    fixture.detectChanges();

    messageElement = fixture.nativeElement.querySelector('.message');
    expect(messageElement?.classList.contains('warning')).toBe(true);
    expect(messageElement?.classList.contains('info')).toBe(false);
  });

  it('should project content correctly', () => {
    expect(hostComponent.message).toBe('Test message content');

    const alertElement = hostFixture.nativeElement.querySelector('app-alert-panel');
    expect(alertElement?.textContent).toContain('Test message content');
  });
  it('should update content when host component message changes', () => {
    // Create a new test instance with different message
    @Component({
      template: `<app-alert-panel [severity]="'info'">Updated message</app-alert-panel>`,
      imports: [AlertPanelComponent],
    })
    class TestHostComponentWithUpdatedMessageComponent {}

    const updatedFixture = TestBed.createComponent(TestHostComponentWithUpdatedMessageComponent);
    updatedFixture.detectChanges();

    const alertElement = updatedFixture.nativeElement.querySelector('app-alert-panel');
    expect(alertElement?.textContent).toContain('Updated message');
  });
  it('should change severity and icon when host component severity changes', () => {
    // Create a new test instance with error severity
    @Component({
      template: `<app-alert-panel [severity]="'error'">Test message</app-alert-panel>`,
      imports: [AlertPanelComponent],
    })
    class TestHostComponentWithErrorSeverityComponent {}

    const errorFixture = TestBed.createComponent(TestHostComponentWithErrorSeverityComponent);
    errorFixture.detectChanges();

    const iconElement = errorFixture.nativeElement.querySelector('mat-icon');
    const messageElement = errorFixture.nativeElement.querySelector('.message');

    expect(iconElement?.textContent?.trim()).toBe('error');
    expect(messageElement?.classList.contains('error')).toBe(true);
  });

  it('should have proper component structure', () => {
    const messageElement = fixture.nativeElement.querySelector('.message');
    const iconElement = fixture.nativeElement.querySelector('mat-icon');
    const contentSlot = fixture.nativeElement.querySelector('ng-content');

    expect(messageElement).toBeTruthy();
    expect(iconElement).toBeTruthy();
    expect(messageElement.contains(iconElement)).toBe(true);
  });

  it('should handle all severity types correctly', () => {
    const severityTests = [
      { severity: 'info', expectedIcon: 'info' },
      { severity: 'error', expectedIcon: 'error' },
      { severity: 'warning', expectedIcon: 'warning' },
      { severity: 'success', expectedIcon: 'check_circle' },
    ] as const;

    severityTests.forEach(({ severity, expectedIcon }) => {
      fixture.componentRef.setInput('severity', severity);
      fixture.detectChanges();

      expect(component.icon).toBe(expectedIcon);

      const messageElement = fixture.nativeElement.querySelector('.message');
      expect(messageElement?.classList.contains(severity)).toBe(true);
    });
  });
});
