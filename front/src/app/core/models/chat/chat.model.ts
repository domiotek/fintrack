import { User } from '../user/user.model';
import { LastReadMessage } from './last-read-message.model';
import { ChatMessage } from './message.model';
import { Participant } from './participant.model';

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
  participants: Participant[];
  lastReadMessageByUserId: Record<number, LastReadMessage>;
}
