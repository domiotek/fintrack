import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PrivateChat } from '../../models/chat/chat.model';
import { ChatMessage } from '../../models/chat/message.model';
import { mockedChats, mockChatMessages } from './mock-chat-data';
import { BasePagingResponse } from '../../models/api/paging.model';
import { User } from '../../models/user/user.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly connectedChatId = signal<string | null>(null);
  private readonly typingUsers = new BehaviorSubject<User[]>([]);
  private readonly lastReadMessagesMap = new BehaviorSubject<Record<number, string>>({});
  private typingGenerator?: ReturnType<typeof setInterval>;

  readonly typingUsers$ = this.typingUsers.asObservable();
  readonly lastReadMessagesMap$ = this.lastReadMessagesMap.asObservable();

  private readonly mockUsers: User[] = [
    {
      id: 1,
      name: 'Konrad',
      surname: 'Serwa',
      email: 'konrad.serwa@example.com',
    },
    {
      id: 2,
      name: 'Artur',
      surname: 'Pajor',
      email: 'artur.pajor@example.com',
    },
    {
      id: 0,
      name: 'Damian',
      surname: 'Omiotek',
      email: 'damian.omiotek@example.com',
    },
  ];

  getPrivateChatsList(): Observable<PrivateChat[]> {
    return of([...mockedChats]);
  }

  getUserIdsWithPrivateChat(): Observable<number[]> {
    return of([1, 2, 4]);
  }

  connectToChat(chatId: string): Observable<void> {
    this.connectedChatId.set(chatId);
    this.startTypingGenerator();
    return of();
  }

  private startTypingGenerator(): void {
    this.stopTypingGenerator();

    const generateTypingEvent = () => {
      const shouldHaveTypingUsers = Math.random() > 0.7; // 30% chance of having typing users

      if (shouldHaveTypingUsers) {
        const numTypingUsers = Math.floor(Math.random() * 2) + 1; // 1-2 users
        const shuffledUsers = [...this.mockUsers].sort(() => Math.random() - 0.5);
        const typingUsers = shuffledUsers.slice(0, numTypingUsers);
        this.typingUsers.next(typingUsers);

        // Stop typing after 2-5 seconds
        setTimeout(
          () => {
            this.typingUsers.next([]);
          },
          Math.random() * 3000 + 2000,
        );
      } else {
        this.typingUsers.next([]);
      }
    };

    // Generate typing events every 3-8 seconds
    const scheduleNext = () => {
      const delay = Math.random() * 5000 + 3000;
      this.typingGenerator = setTimeout(() => {
        generateTypingEvent();
        scheduleNext();
      }, delay);
    };

    scheduleNext();
  }

  private stopTypingGenerator(): void {
    if (this.typingGenerator) {
      clearTimeout(this.typingGenerator);
      this.typingGenerator = undefined;
    }
    this.typingUsers.next([]);
  }

  getChatMessages(offset: number): Observable<BasePagingResponse<ChatMessage>> {
    const pageSize = 30;
    const startIndex = offset;
    const endIndex = startIndex + pageSize;
    const page = mockChatMessages.slice(startIndex, endIndex);

    return of({
      content: page,
      page: {
        size: pageSize,
        number: Math.floor(startIndex / pageSize),
        totalElements: mockChatMessages.length,
        totalPages: Math.ceil(mockChatMessages.length / pageSize),
      },
    }).pipe(delay(1000));
  }
}
