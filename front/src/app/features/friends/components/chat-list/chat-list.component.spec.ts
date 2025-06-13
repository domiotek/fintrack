import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatListComponent } from './chat-list.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { FriendsStateStore } from '../../store/friends-state.store';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { BehaviorSubject, EMPTY } from 'rxjs';

describe('ChatListComponent', () => {
  let component: ChatListComponent;
  let fixture: ComponentFixture<ChatListComponent>;
  let mockChatService: jasmine.SpyObj<ChatService>;

  beforeEach(async () => {
    mockChatService = jasmine.createSpyObj(
      'ChatService',
      ['sendMessage', 'signalStartedTyping', 'signalStoppedTyping', 'disconnectFromChat', 'getPrivateChatIdByUserId'],
      {
        messages$: new BehaviorSubject([]),
        lastReadMessagesMap$: new BehaviorSubject({}),
        lastUserActivityMap$: new BehaviorSubject({}),
        typingUsers$: new BehaviorSubject([]),
        activityTicker$: EMPTY,
        privateChatsUpdates$: EMPTY,
      },
    );

    // Mock getPrivateChatIdByUserId to return an observable
    mockChatService.getPrivateChatIdByUserId.and.returnValue(new BehaviorSubject('test-chat-id'));

    await TestBed.configureTestingModule({
      imports: [ChatListComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: ChatService, useValue: mockChatService },
        AppStateStore,
        FriendsStateStore,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
