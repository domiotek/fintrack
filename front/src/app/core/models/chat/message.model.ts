import { User } from '../users/user';

export interface ChatMessage {
  id: string;
  authorType: 'system' | 'user';
  sentBy?: User;
  sentAt: string;
  content: string;
}
