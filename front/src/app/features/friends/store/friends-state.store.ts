import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY_FRIENDS_STATE } from '../constants/empty-friends-state.const';
import { IFriendsState } from '../models/friends-state.model';

@Injectable({ providedIn: 'root' })
export class FriendsStateStore extends ComponentStore<IFriendsState> {
  constructor() {
    super(EMPTY_FRIENDS_STATE);
  }

  readonly selectedChat = this.selectSignal((state) => state.selectedChat);

  readonly setSelectedChat = this.updater((state, chat: IFriendsState['selectedChat']) => ({
    ...state,
    selectedChat: chat,
  }));
}
