import { Component, inject, OnInit, signal } from '@angular/core';
import { IWidget } from '../../../../core/models/statistics/widget';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { EventsService } from '../../../../core/services/events/events.service';
import { Event } from '../../../../core/models/events/event';
import { CustomListComponent } from '../../../../shared/components/custom-list/custom-list.component';
import { EventItemComponent } from '../../../events/components/event-item/event-item.component';

@Component({
  selector: 'app-events-widget',
  imports: [CustomListComponent, EventItemComponent],
  templateUrl: './events-widget.component.html',
  styleUrl: './events-widget.component.scss',
})
export class EventsWidgetComponent extends BaseWidgetComponent implements IWidget, OnInit {
  readonly events = signal<Event[]>([]);

  readonly eventsService = inject(EventsService);

  override ngOnInit() {
    this.onInit.next({
      hasInteraction: true,
    });

    super.ngOnInit();
  }

  loadData(): void {
    this.eventsService
      .getEvents(
        {
          from: this.timeRange().from.toISO(),
          to: this.timeRange().to.toISO(),
        },
        {
          size: 5,
          page: 0,
        },
      )
      .subscribe({
        next: (events) => {
          this.events.set(events.content);
          this.onLoad.next(true);
        },
        error: () => {
          this.onLoad.next(false);
        },
      });
  }

  triggerAction(): void {
    this.routingService.navigate(['/events'], { timeRange: this.timeRange() });
  }

  onSelectEvent(event: Event): void {
    this.routingService.navigate(['/events'], { eventId: event.id, timeRange: this.timeRange() });
  }
}
