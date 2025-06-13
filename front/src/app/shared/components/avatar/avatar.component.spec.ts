import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarComponent } from './avatar.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarComponent);
    fixture.componentRef.setInput('name', 'Test User');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display first letter of name in uppercase', () => {
    fixture.componentRef.setInput('name', 'john');
    fixture.detectChanges();

    const spanElement = fixture.nativeElement.querySelector('span');
    expect(spanElement.textContent.trim()).toBe('J');
  });

  it('should display first letters of name and surname when both provided', () => {
    fixture.componentRef.setInput('name', 'john');
    fixture.componentRef.setInput('surname', 'doe');
    fixture.detectChanges();

    const spanElement = fixture.nativeElement.querySelector('span');
    expect(spanElement.textContent.trim()).toBe('JD');
  });

  it('should show online indicator when showOnline is true', () => {
    fixture.componentRef.setInput('showOnline', true);
    fixture.detectChanges();

    const activityDot = fixture.nativeElement.querySelector('.activity-dot');
    expect(activityDot).toBeTruthy();
  });

  it('should not show online indicator when showOnline is false', () => {
    fixture.componentRef.setInput('showOnline', false);
    fixture.detectChanges();

    const activityDot = fixture.nativeElement.querySelector('.activity-dot');
    expect(activityDot).toBeFalsy();
  });

  it('should handle empty surname gracefully', () => {
    fixture.componentRef.setInput('name', 'john');
    fixture.componentRef.setInput('surname', '');
    fixture.detectChanges();

    const spanElement = fixture.nativeElement.querySelector('span');
    expect(spanElement.textContent.trim()).toBe('J');
  });
});
