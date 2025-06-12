export interface GenericSocketRequest {
  userId: number;
}

export interface PostMessageRequest extends GenericSocketRequest {
  message: string;
}

export interface UpdateLastReadMessageRequest extends GenericSocketRequest {
  messageId: number;
}
