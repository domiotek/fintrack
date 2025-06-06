import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSystemMessageComponent } from './chat-system-message.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('ChatSystemMessageComponent', () => {
  let component: ChatSystemMessageComponent;
  let fixture: ComponentFixture<ChatSystemMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatSystemMessageComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatSystemMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
