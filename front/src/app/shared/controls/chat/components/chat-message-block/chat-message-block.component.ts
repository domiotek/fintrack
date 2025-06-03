import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
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
  readonly readIndicators = input<Record<string, number[]>>({});

  get lastMessage(): ChatMessage {
    return this.messages()[this.messages().length - 1];
  }

  getReadIndicatorStatus(message: ChatMessage): boolean {
    const readBy = this.readIndicators()[message.id] || [];
    return readBy.length > 0;
  }

  getSentAtString(message: ChatMessage): string {
    return DateTime.fromISO(message.sentAt).toFormat('HH:mm');
  }

  //   wasRead = useCallback(
  //     (message: App.Models.IChatMessage) => {
  //       const lastReadMessage = conversation.lastReadMessages[userDetails!.userId];

  //       if (!lastReadMessage) return false;

  //       const lastRead = DateTime.fromISO(lastReadMessage.created);
  //       const currMessage = DateTime.fromISO(message.created);

  //       return currMessage <= lastRead;
  //     },
  //     [conversation],
  //   );

  //   readMessage = useCallback(
  //     debounce((message: App.Models.IChatMessage) => {
  //       invoke('ReadMessage', conversation.id, message.id);
  //     }, 300),
  //     [conversation],
  //   );
}
