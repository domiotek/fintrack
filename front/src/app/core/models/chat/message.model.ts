import { User } from '../users/user';

export interface ChatMessage {
  id: number;
  authorType: 'system' | 'user';
  sentBy?: User;
  sentAt: string;
  content: string;
}
