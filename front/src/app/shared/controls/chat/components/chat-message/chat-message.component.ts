import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-chat-message',
  imports: [CommonModule],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
})
export class ChatMessageComponent {
  readonly type = input.required<'my' | 'their'>();

  readonly hasReadIndicator = input(false);
}
