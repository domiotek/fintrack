import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ChatService } from '../../../../../core/services/chat/chat.service';

@Component({
  selector: 'app-chat-input',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss',
})
export class ChatInputComponent {
  readonly messageInput = new FormControl<string>('');
  readonly outputText = output<string>();
  private typingTimer?: ReturnType<typeof setTimeout>;
  private signaledTyping = false;

  private readonly chatService = inject(ChatService);

  onInput(): void {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }

    if (!this.signaledTyping) {
      this.signaledTyping = true;

      this.chatService.signalStartedTyping();
    }

    this.typingTimer = setTimeout(() => {
      this.chatService.signalStoppedTyping();
      this.signaledTyping = false;
    }, 1000);
  }

  onEnterKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage(): void {
    if (!this.messageInput.value?.trim()) return;

    this.outputText.emit(this.messageInput.value.trim());
    this.messageInput.setValue('');
  }
}
