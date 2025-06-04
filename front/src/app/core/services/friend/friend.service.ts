import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { BaseApiService } from '../base-api.service';
import { FriendRequest } from '../../models/friend/friend-request.model';
import { toObservable } from '@angular/core/rxjs-interop';
import { User } from '../../models/user/user.model';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class FriendService extends BaseApiService {
  private readonly friendRequests = signal<FriendRequest[]>([]);
  readonly friendRequests$: Observable<FriendRequest[]> = toObservable(this.friendRequests);

  private readonly friends = new BehaviorSubject<User[]>([]);
  private readonly friends$: Observable<User[]> = this.friends.asObservable();
  private readonly lastFriendsFetch = signal<DateTime | null>(null);
  private readonly maxFriendsFreshnessTime = 360; // seconds

  readonly mockedRequests = [
    { id: 1, name: 'John', surname: 'Doe', email: 'johndoe@example.com', createdAt: '2025-05-01T13:00:00' },
  ];

  readonly mockedFriends = [
    {
      id: 1,
      name: 'Damian',
      surname: 'Omiotek',
      email: 'domiotek@example.com',
    },
    {
      id: 2,
      name: 'Artur',
      surname: 'Pajor',
      email: 'apajor@example.com',
    },
    {
      id: 3,
      name: 'Konrad',
      surname: 'Serwa',
      email: 'kserwa@example.com',
    },
    {
      id: 3,
      name: 'Konrad',
      surname: 'Serwa',
      email: 'kserwa@example.com',
    },

    {
      id: 3,
      name: 'Konrad',
      surname: 'Serwa',
      email: 'kserwa@example.com',
    },
    {
      id: 3,
      name: 'Konrad',
      surname: 'Serwa',
      email: 'kserwa@example.com',
    },
    {
      id: 3,
      name: 'Konrad',
      surname: 'Serwa',
      email: 'kserwa@example.com',
    },
    {
      id: 3,
      name: 'Konrad',
      surname: 'Serwa',
      email: 'kserwa@example.com',
    },
    {
      id: 3,
      name: 'Konrad',
      surname: 'Serwa',
      email: 'kserwa@example.com',
    },
    {
      id: 3,
      name: 'Konrad',
      surname: 'Serwa',
      email: 'kserwa@example.com',
    },
    {
      id: 3,
      name: 'Konrad',
      surname: 'Serwa',
      email: 'kserwa@example.com',
    },
    {
      id: 3,
      name: 'Konrad',
      surname: 'Serwa',
      email: 'kserwa@example.com',
    },
    {
      id: 3,
      name: 'Konrad',
      surname: 'Serwa',
      email: 'kserwa@example.com',
    },
    {
      id: 3,
      name: 'Konrad',
      surname: 'Serwa',
      email: 'kserwa@example.com',
    },
    {
      id: 3,
      name: 'Konrad',
      surname: 'Serwa',
      email: 'kserwa@example.com',
    },
    {
      id: 3,
      name: 'Konrad',
      surname: 'Serwa',
      email: 'kserwa@example.com',
    },
    {
      id: 4,
      name: 'Mateusz',
      surname: 'Płatek',
      email: 'mplatek@example.com',
    },
  ];

  invalidateAndRefetchFriendsList(): Observable<User[]> {
    this.friends.next(this.mockedFriends);
    this.lastFriendsFetch.set(DateTime.now());

    return this.friends$;
  }

  getFriendsList(): Observable<User[]> {
    if (!this.lastFriendsFetch() || this.lastFriendsFetch()!.diffNow().as('seconds') > this.maxFriendsFreshnessTime) {
      return this.invalidateAndRefetchFriendsList();
    }

    return this.friends$;
  }

  sendFriendRequest(email: string): Observable<void> {
    return of();
  }

  getPendingFriendRequests(): Observable<void> {
    this.friendRequests.set(this.mockedRequests);

    return of();
  }

  answerFriendRequest(id: number, accept: boolean): Observable<void> {
    this.friendRequests.update((requests) => {
      return requests.filter((request) => request.id !== id);
    });

    if (accept) {
      this.invalidateAndRefetchFriendsList();
    }

    return of();
  }

  removeFriend(userId: number): Observable<void> {
    this.invalidateAndRefetchFriendsList();
    return of();
  }
}
