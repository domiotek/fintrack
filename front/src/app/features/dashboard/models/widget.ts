import { Observable } from 'rxjs';

export interface IWidget {
  onInit$: Observable<IWidgetConfig>;
  onLoad$: Observable<void>;
  onRefresh$: Observable<void>;

  triggerAction(): void;
}

export interface IWidgetConfig {
  hasInteraction: boolean;
}
