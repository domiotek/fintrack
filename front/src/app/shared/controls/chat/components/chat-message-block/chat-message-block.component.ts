import { Component, input } from '@angular/core';
import { AvatarComponent } from '../../../../components/avatar/avatar.component';
import { CommonModule } from '@angular/common';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChatMessage } from '../../../../../core/models/chat/message.model';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-chat-message-block',
  imports: [CommonModule, MatTooltipModule, AvatarComponent, ChatMessageComponent],
  templateUrl: './chat-message-block.component.html',
  styleUrl: './chat-message-block.component.scss',
})
export class ChatMessageBlockComponent {
  readonly type = input.required<'my' | 'their'>();
  readonly name = input.required<string>();
  readonly surname = input.required<string>();
  readonly messages = input.required<ChatMessage[]>();

  getSentAtString(message: ChatMessage): string {
    return DateTime.fromISO(message.sentAt).toFormat('HH:mm');
  }
}
