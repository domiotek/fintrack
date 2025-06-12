import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

interface IChatState {
  loading: boolean;
  scrollSnapMessageId: number | null;
  isWindowActive: boolean;
}

const EMPTY_CHAT_STATE: IChatState = {
  loading: false,
  scrollSnapMessageId: null,
  isWindowActive: !document.hidden && document.hasFocus(),
};

@Injectable({ providedIn: 'root' })
export class ChatStateStore extends ComponentStore<IChatState> {
  constructor() {
    super(EMPTY_CHAT_STATE);
  }

  readonly loading = this.selectSignal((state) => state.loading);

  readonly setLoading = this.updater((state, loading: boolean) => ({
    ...state,
    loading,
  }));

  readonly scrollSnapMessageId = this.selectSignal((state) => state.scrollSnapMessageId);

  readonly setScrollSnapMessageId = this.updater((state, messageId: number | null) => ({
    ...state,
    scrollSnapMessageId: messageId,
  }));

  readonly isWindowActive = this.selectSignal((state) => state.isWindowActive);

  readonly setIsWindowActive = this.updater((state, isActive: boolean) => ({
    ...state,
    isWindowActive: isActive,
  }));

  readonly reset = this.updater(() => ({
    ...EMPTY_CHAT_STATE,
  }));
}
