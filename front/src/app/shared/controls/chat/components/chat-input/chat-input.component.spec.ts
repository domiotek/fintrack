import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatInputComponent } from './chat-input.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ChatService } from '../../../../../core/services/chat/chat.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppStateStore } from '../../../../../core/store/app-state.store';
import { BehaviorSubject, EMPTY } from 'rxjs';

describe('ChatInputComponent', () => {
  let component: ChatInputComponent;
  let fixture: ComponentFixture<ChatInputComponent>;
  let mockChatService: jasmine.SpyObj<ChatService>;

  beforeEach(async () => {
    mockChatService = jasmine.createSpyObj(
      'ChatService',
      ['signalStartedTyping', 'signalStoppedTyping', 'disconnectFromChat'],
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
      imports: [ChatInputComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: ChatService, useValue: mockChatService },
        AppStateStore,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display placeholder text', () => {
    const labelElement = fixture.nativeElement.querySelector('mat-label');
    expect(labelElement?.textContent?.trim()).toBe('Wprowadź wiadomość...');
  });

  it('should update message input when typing', () => {
    const testMessage = 'Hello world';
    component.onInput(testMessage);

    expect(component.messageInput()).toBe(testMessage);
  });

  it('should signal typing when input starts', () => {
    component.onInput('Hello');

    expect(mockChatService.signalStartedTyping).toHaveBeenCalled();
  });

  it('should not signal typing multiple times for consecutive inputs', () => {
    component.onInput('H');
    component.onInput('He');
    component.onInput('Hel');

    expect(mockChatService.signalStartedTyping).toHaveBeenCalledTimes(1);
  });

  it('should emit message when send button is clicked', () => {
    spyOn(component.outputText, 'emit');
    const testMessage = 'Test message';

    component.messageInput.set(testMessage);
    fixture.detectChanges();

    component.sendMessage();

    expect(component.outputText.emit).toHaveBeenCalledWith(testMessage);
    expect(component.messageInput()).toBe('');
  });

  it('should not emit empty messages', () => {
    spyOn(component.outputText, 'emit');

    component.sendMessage();

    expect(component.outputText.emit).not.toHaveBeenCalled();
  });

  it('should trim whitespace from messages', () => {
    spyOn(component.outputText, 'emit');
    const messageWithSpaces = '  Test message  ';

    component.messageInput.set(messageWithSpaces);
    component.sendMessage();

    expect(component.outputText.emit).toHaveBeenCalledWith('Test message');
  });

  it('should send message on Enter key press', () => {
    spyOn(component.outputText, 'emit');
    const testMessage = 'Test message';
    component.messageInput.set(testMessage);

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    spyOn(enterEvent, 'preventDefault');

    component.onEnterKey(enterEvent);

    expect(enterEvent.preventDefault).toHaveBeenCalled();
    expect(component.outputText.emit).toHaveBeenCalledWith(testMessage);
  });

  it('should not send message on Shift+Enter', () => {
    spyOn(component.outputText, 'emit');
    const testMessage = 'Test message';
    component.messageInput.set(testMessage);

    const shiftEnterEvent = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true });
    spyOn(shiftEnterEvent, 'preventDefault');

    component.onEnterKey(shiftEnterEvent);

    expect(shiftEnterEvent.preventDefault).not.toHaveBeenCalled();
    expect(component.outputText.emit).not.toHaveBeenCalled();
  });

  it('should disable send button when input is empty', () => {
    const sendButton = fixture.nativeElement.querySelector('button[mat-icon-button]');
    expect(sendButton.disabled).toBe(true);
  });

  it('should disable textarea when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector('textarea');
    expect(textarea.disabled).toBe(true);
  });

  it('should disable send button when component is disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const sendButton = fixture.nativeElement.querySelector('button[mat-icon-button]');
    expect(sendButton.disabled).toBe(true);
  });

  it('should have correct textarea attributes', () => {
    const textarea = fixture.nativeElement.querySelector('textarea');

    expect(textarea.getAttribute('matInput')).toBe('');
    expect(textarea.getAttribute('cdkTextareaAutosize')).toBe('');
    expect(textarea.getAttribute('title')).toBe('Wprowadź wiadomość');
  });

  it('should display send icon in button', () => {
    const iconElement = fixture.nativeElement.querySelector('button mat-icon');
    expect(iconElement?.textContent?.trim()).toBe('send');
  });
});
