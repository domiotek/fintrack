import { ChatMessage } from '../../../../core/models/chat/message.model';

export type ChatBlock = ChatSystemBlock | ChatMessageBlock;

export interface ChatSystemBlock {
  id: number;
  type: 'system';
  message: string;
}

export interface ChatMessageBlock {
  type: 'user';
  userId: number;
  perspective: 'my' | 'their';
  name: string;
  surname: string;
  lastActivityDateTime: string;
  messages: ChatMessage[];
}
