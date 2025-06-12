import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBlocksWrapperComponent } from './chat-blocks-wrapper.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ChatStateStore } from '../../store/chat-state.store';
import { AppStateStore } from '../../../../../core/store/app-state.store';

describe('ChatBlocksWrapperComponent', () => {
  let component: ChatBlocksWrapperComponent;
  let fixture: ComponentFixture<ChatBlocksWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatBlocksWrapperComponent],
      providers: [provideExperimentalZonelessChangeDetection(), ChatStateStore, AppStateStore],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatBlocksWrapperComponent);
    fixture.componentRef.setInput('messages', []);
    fixture.componentRef.setInput('currentUserId', null);
    fixture.componentRef.setInput('lastUserActivityTime', {});
    fixture.componentRef.setInput('messagesWithReadIndicators', {});
    fixture.componentRef.setInput('myLastReadMessageId', null);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
