import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatContainerComponent } from './chat-container.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppStateStore } from '../../../../core/store/app-state.store';

describe('ChatContainerComponent', () => {
  let component: ChatContainerComponent;
  let fixture: ComponentFixture<ChatContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatContainerComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        ChatService,
        AppStateStore,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatContainerComponent);
    fixture.componentRef.setInput('otherParticipant', {});
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
