import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypingIndicatorComponent } from './typing-indicator.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('TypingIndicatorComponent', () => {
  let component: TypingIndicatorComponent;
  let fixture: ComponentFixture<TypingIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypingIndicatorComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TypingIndicatorComponent);
    fixture.componentRef.setInput('typingUsers', []);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
