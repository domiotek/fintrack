import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatItemComponent } from './chat-item.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ChatItemComponent', () => {
  let component: ChatItemComponent;
  let fixture: ComponentFixture<ChatItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatItemComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        AppStateStore,
        ChatService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatItemComponent);
    fixture.componentRef.setInput('item', {
      id: 'chat-id',
      lastMessage: null,
      lastReadMessageId: null,
      isFriend: true,
      otherParticipant: {
        firstName: 'John',
      },
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
