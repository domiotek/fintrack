import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FriendsComponent } from './friends.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { BehaviorSubject, EMPTY } from 'rxjs';

describe('FriendsComponent', () => {
  let component: FriendsComponent;
  let fixture: ComponentFixture<FriendsComponent>;
  let mockChatService: jasmine.SpyObj<ChatService>;

  beforeEach(async () => {
    mockChatService = jasmine.createSpyObj(
      'ChatService',
      ['sendMessage', 'signalStartedTyping', 'signalStoppedTyping', 'disconnectFromChat'],
      {
        messages$: new BehaviorSubject([]),
        lastReadMessagesMap$: new BehaviorSubject({}),
        lastUserActivityMap$: new BehaviorSubject({}),
        typingUsers$: new BehaviorSubject([]),
        activityTicker$: EMPTY,
        privateChatsUpdates$: EMPTY,
      },
    );

    await TestBed.configureTestingModule({
      imports: [FriendsComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: ChatService, useValue: mockChatService },
        AppStateStore,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
