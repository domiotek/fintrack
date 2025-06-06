import { ChatMessage } from '../../../../core/models/chat/message.model';

export type ChatBlock = ChatSystemBlock | ChatMessageBlock;

export interface ChatSystemBlock {
  id: string;
  type: 'system';
  message: string;
}

export interface ChatMessageBlock {
  type: 'user';
  userId: number;
  perspective: 'my' | 'their';
  name: string;
  surname: string;
  messages: ChatMessage[];
}
