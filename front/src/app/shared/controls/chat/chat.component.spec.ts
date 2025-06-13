import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatComponent } from './chat.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ChatService } from '../../../core/services/chat/chat.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppStateStore } from '../../../core/store/app-state.store';
import { BehaviorSubject, EMPTY } from 'rxjs';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let mockChatService: jasmine.SpyObj<ChatService>;

  beforeEach(async () => {
    mockChatService = jasmine.createSpyObj(
      'ChatService',
      [
        'sendMessage',
        'signalStartedTyping',
        'signalStoppedTyping',
        'disconnectFromChat',
        'connectToChat',
        'updateLastActivity',
      ],
      {
        messages$: new BehaviorSubject([]),
        lastReadMessagesMap$: new BehaviorSubject({}),
        lastUserActivityMap$: new BehaviorSubject({}),
        typingUsers$: new BehaviorSubject([]),
        activityTicker$: EMPTY,
        privateChatsUpdates$: EMPTY,
      },
    );

    // Mock connectToChat to return a resolved promise
    mockChatService.connectToChat.and.returnValue(
      Promise.resolve({
        messages: { content: [], page: { totalPages: 1, number: 0 } },
        lastReadMessages: [],
        lastActivities: [],
      } as any),
    );

    await TestBed.configureTestingModule({
      imports: [ChatComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: ChatService, useValue: mockChatService },
        AppStateStore,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    fixture.componentRef.setInput('chatId', 'test-chat-id');
    fixture.componentRef.setInput('chatParticipants', []);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
