import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserItemComponent } from './user-item.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { User } from '../../../core/models/user/user.model';

describe('UserItemComponent', () => {
  let component: UserItemComponent;
  let fixture: ComponentFixture<UserItemComponent>;

  const mockUser: User = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserItemComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserItemComponent);
    fixture.componentRef.setInput('item', mockUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user first and last name', () => {
    const nameElement = fixture.nativeElement.querySelector('.name');
    expect(nameElement?.textContent?.trim()).toBe('John Doe');
  });

  it('should pass first name to avatar component', () => {
    const avatarElement = fixture.nativeElement.querySelector('app-avatar');
    expect(avatarElement).toBeTruthy();
  });

  it('should show email when showEmail input is true', () => {
    fixture.componentRef.setInput('showEmail', true);
    fixture.detectChanges();

    const emailElement = fixture.nativeElement.querySelector('.secondary-text');
    expect(emailElement?.textContent?.trim()).toBe('john.doe@example.com');
  });

  it('should hide email when showEmail input is false', () => {
    fixture.componentRef.setInput('showEmail', false);
    fixture.detectChanges();

    const emailElement = fixture.nativeElement.querySelector('.secondary-text');
    expect(emailElement).toBeFalsy();
  });

  it('should hide email by default', () => {
    const emailElement = fixture.nativeElement.querySelector('.secondary-text');
    expect(emailElement).toBeFalsy();
  });

  it('should have required item input', () => {
    expect(component.item()).toEqual(mockUser);
  });

  it('should have proper component structure', () => {
    const avatarElement = fixture.nativeElement.querySelector('app-avatar');
    const middleContainer = fixture.nativeElement.querySelector('.middle-container');
    const endContainer = fixture.nativeElement.querySelector('.end-container');

    expect(avatarElement).toBeTruthy();
    expect(middleContainer).toBeTruthy();
    expect(endContainer).toBeTruthy();
  });
  it('should handle user with only first name', () => {
    const userWithoutLastName = { ...mockUser, lastName: '' };
    fixture.componentRef.setInput('item', userWithoutLastName);
    fixture.detectChanges();

    const nameElement = fixture.nativeElement.querySelector('.name');
    expect(nameElement?.textContent?.trim()).toBe('John');
  });
});
