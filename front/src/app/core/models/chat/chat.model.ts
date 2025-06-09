import { User } from '../user/user.model';
import { ChatMessage } from './message.model';

export interface Chat {
  id: string;
  lastMessage: ChatMessage | null;
  lastReadMessageId: number | null;
}

export interface PrivateChat extends Chat {
  isFriend: boolean;
  otherParticipant: User;
}
