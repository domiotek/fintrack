import { Friend } from '../friend/friend.model';
import { LastReadMessage } from './last-read-message.model';
import { ChatMessage } from './message.model';

export interface Chat {
  id: string;
  name: string;
  lastMessage: ChatMessage;
  lastReadMessageId?: string;
}

export interface PrivateChat extends Chat {
  isFriend: boolean;
}

export interface FullyFetchedChat extends Chat {
  participants: Friend[];
  messages: ChatMessage[];
  lastReadMessageByUserId: Record<number, LastReadMessage>;
}
