import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { FullyFetchedChat, PrivateChat } from '../../models/chat/chat.model';
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
  private readonly messages = new BehaviorSubject<ChatMessage[]>([]);
  private readonly lastReadMessagesMap = new BehaviorSubject<Record<number, string>>({});

  private typingGenerator?: ReturnType<typeof setInterval>;

  readonly typingUsers$ = this.typingUsers.asObservable();
  readonly lastReadMessagesMap$ = this.lastReadMessagesMap.asObservable();
  readonly messages$ = this.messages.asObservable();

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

  connectToChat(chatId: string): Observable<FullyFetchedChat> {
    this.connectedChatId.set(chatId);
    this.startTypingGenerator();

    const otherUsers = this.mockUsers.filter((user) => user.id !== 0);

    // populate last read messages map
    const lastReadMessages: Record<number, string> = {};
    const lastMessage = mockChatMessages[mockChatMessages.length - 1];
    const secondLastMessage = mockChatMessages[mockChatMessages.length - 2];

    // First user reads up to last message, others up to second last
    lastReadMessages[otherUsers[0].id] = lastMessage.id;
    otherUsers.slice(1).forEach((user) => {
      lastReadMessages[user.id] = secondLastMessage.id;
    });
    this.lastReadMessagesMap.next(lastReadMessages);

    // populate messages with read indicators
    const messagesWithReadIndicators: Record<string, number[]> = {};
    messagesWithReadIndicators[lastMessage.id] = [otherUsers[0].id];
    messagesWithReadIndicators[secondLastMessage.id] = otherUsers.map((user) => user.id);

    // Setup intervals to continuously update read status for each user
    otherUsers.forEach((user, index) => {
      const delay = 1000 + index * 4000; // Different delay for each user: 1s, 5s, 9s
      setInterval(() => {
        const currentMessages = this.messages.value;
        if (currentMessages.length === 0) return;

        const lastMessage = currentMessages[currentMessages.length - 1];
        const updatedLastReadMessages = { ...this.lastReadMessagesMap.value };

        updatedLastReadMessages[user.id] = lastMessage.id;

        this.lastReadMessagesMap.next(updatedLastReadMessages);
      }, delay);
    });

    // simulate other users sending messages
    setInterval(() => {
      const randomUser = this.mockUsers[Math.floor(Math.random() * (this.mockUsers.length - 1)) + 1]; // Exclude user with id 0
      const newMessage: ChatMessage = {
        id: (this.messages.value[this.messages.value.length - 1].id + 1).toString(),
        content: `Message from ${randomUser.name} ${randomUser.surname}`,
        sentAt: new Date().toISOString(),
        authorId: randomUser.id,
        authorName: randomUser.name,
        authorSurname: randomUser.surname,
        authorType: 'user',
      };

      this.messages.next([...this.messages.value, newMessage]);
    }, 5000);

    return of({
      participants: [...this.mockUsers],
      lastReadMessageByUserId: {},
      id: chatId,
      name: 'Mock Chat',
      lastMessage: mockChatMessages[0],
    });
  }

  sendMessage(message: string): Observable<void> {
    const newMessage: ChatMessage = {
      id: (this.messages.value[this.messages.value.length - 1].id + 1).toString(),
      content: message,
      sentAt: new Date().toISOString(),
      authorId: 0,
      authorName: this.mockUsers[0].name,
      authorSurname: this.mockUsers[0].surname,
      authorType: 'user',
    };

    this.messages.next([...this.messages.value, newMessage]);

    return of(undefined);
  }

  private startTypingGenerator(): void {
    this.stopTypingGenerator();

    const generateTypingEvent = () => {
      const shouldHaveTypingUsers = Math.random() > 0.3; // 30% chance of having typing users

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

  getNextChatMessages(offset: number): Observable<BasePagingResponse<ChatMessage>> {
    const pageSize = 30;
    const reversedMessages = [...mockChatMessages].reverse();
    const startIndex = offset;
    const endIndex = startIndex + pageSize;
    const page = reversedMessages.slice(startIndex, endIndex);

    this.messages.next([...page.reverse(), ...this.messages.value]);

    return of({
      content: page.reverse(),
      page: {
        size: pageSize,
        number: Math.floor(startIndex / pageSize),
        totalElements: mockChatMessages.length,
        totalPages: Math.ceil(mockChatMessages.length / pageSize),
      },
    }).pipe(delay(1000));
  }

  signalStartedTyping(): void {
    this.typingUsers.next([...this.typingUsers.value, this.mockUsers.filter((user) => user.id == 0)[0]]); // Simulate current user typing
  }

  signalStoppedTyping(): void {
    this.typingUsers.next(this.typingUsers.value.filter((user) => user.id !== 0));
  }
}
