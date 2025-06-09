import { BasePagingResponse } from '../api/paging.model';
import { LastActivity } from './last-activity.model';
import { LastReadMessage } from './last-read-message.model';
import { ChatMessage } from './message.model';

export interface ChatState {
  messages: BasePagingResponse<ChatMessage>;
  lastReadMessages: LastReadMessage[];
  lastActivities: LastActivity[];
}
