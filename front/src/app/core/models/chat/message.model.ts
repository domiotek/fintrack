export interface ChatMessage {
  id: string;
  authorType: 'system' | 'user';
  authorId?: number;
  authorName?: string;
  authorSurname?: string;
  sentAt: string;
  content: string;
}
