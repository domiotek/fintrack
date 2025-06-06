import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessageBlockComponent } from './chat-message-block.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ChatMessage } from '../../../../../core/models/chat/message.model';

describe('ChatMessageBlockComponent', () => {
  let component: ChatMessageBlockComponent;
  let fixture: ComponentFixture<ChatMessageBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatMessageBlockComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatMessageBlockComponent);
    fixture.componentRef.setInput('type', 'my');
    fixture.componentRef.setInput('name', 'Test User');
    fixture.componentRef.setInput('surname', 'User');
    const chatMessage: ChatMessage = {
      id: '1',
      content: 'Hello, this is a test message.',
      authorType: 'user',
      sentAt: new Date().toISOString(),
    };
    fixture.componentRef.setInput('messages', [chatMessage]);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
