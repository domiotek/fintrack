import { Component, computed, DestroyRef, inject, input, output } from '@angular/core';
import { ChatBlock, ChatMessageBlock } from '../../models/chat-message-block.model';
import { DateTime } from 'luxon';
import { DEFAULT_CHAT_MAX_BLOCK_TIME_DIFFERENCE } from '../../constants/chat.const';
import { ChatMessage } from '../../../../../core/models/chat/message.model';
import { ChatSystemMessageComponent } from '../chat-system-message/chat-system-message.component';
import { ChatMessageBlockComponent } from '../chat-message-block/chat-message-block.component';
import { ChatStateStore } from '../../store/chat-state.store';
import { callDebounced } from '../../../../../utils/debouncer';

@Component({
  selector: 'app-chat-blocks-wrapper',
  imports: [ChatSystemMessageComponent, ChatMessageBlockComponent],
  templateUrl: './chat-blocks-wrapper.component.html',
  styleUrl: './chat-blocks-wrapper.component.scss',
})
export class ChatBlocksWrapperComponent {
  private readonly store = inject(ChatStateStore);
  private readonly destroyRef = inject(DestroyRef);

  readonly messages = input.required<ChatMessage[]>();
  readonly currentUserId = input.required<number | null>();
  readonly lastUserActivityTime = input.required<Record<number, string>>();
  readonly messagesWithReadIndicators = input.required<Record<string, number[]>>({});
  readonly myLastReadMessageId = input.required<number | null>();
  readonly messageReadEmit = output<number>();

  readonly isWindowActive = this.store.isWindowActive;

  readonly messageBlocks = computed(() => {
    const blocks: ChatBlock[] = [];

    let currentBlock: ChatMessageBlock | null = null;

    this.messages().forEach((message) => {
      if (message.authorType === 'system') {
        blocks.push({
          id: message.id,
          type: 'system',
          message: message.content,
        });
        currentBlock = null;
        return;
      }

      const lastMessageInCurrentBlock = currentBlock?.messages[currentBlock.messages.length - 1];
      const lastMessageSentAt = DateTime.fromISO(lastMessageInCurrentBlock?.sentAt ?? '');
      const currentMessageSentAt = DateTime.fromISO(message.sentAt);

      const isMessageTooLateForBlock =
        lastMessageSentAt.isValid &&
        lastMessageSentAt.plus({ minutes: DEFAULT_CHAT_MAX_BLOCK_TIME_DIFFERENCE }) < currentMessageSentAt;

      if (!currentBlock || currentBlock.userId !== message.sentBy?.id || isMessageTooLateForBlock) {
        if (isMessageTooLateForBlock || !currentBlock) {
          blocks.push({
            id: message.id,
            type: 'system',
            message: currentMessageSentAt.toFormat('dd LLL yyyy HH:mm'),
          });
        }

        const newBlock: ChatBlock = {
          type: 'user',
          userId: message.sentBy?.id!,
          name: message.sentBy?.firstName!,
          surname: message.sentBy?.lastName!,
          lastActivityDateTime: this.lastUserActivityTime()[message.sentBy?.id!] || '',
          messages: [message],
          perspective: this.currentUserId() === message.sentBy?.id ? 'my' : 'their',
        };
        blocks.push(newBlock);

        currentBlock = newBlock;

        return;
      }

      currentBlock.messages.push(message);
    });

    return blocks;
  });

  readonly onMessageRead = callDebounced(
    (messageId: number) => {
      this.messageReadEmit.emit(messageId);
    },
    300,
    this.destroyRef,
  );

  isMessageBlockFinalized(blockLastMessage: ChatMessage): boolean {
    const myLastReadMessage = this.messages().find((msg) => msg.id === this.myLastReadMessageId());

    if (!myLastReadMessage) return false;

    const blockLastMessageSentAt = DateTime.fromISO(blockLastMessage.sentAt);
    const myLastReadMessageSentAt = DateTime.fromISO(myLastReadMessage.sentAt);

    return blockLastMessageSentAt <= myLastReadMessageSentAt;
  }
}
