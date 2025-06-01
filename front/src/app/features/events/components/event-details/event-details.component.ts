import { CommonModule } from '@angular/common';
import { Component, inject, input, OnChanges, OnInit, output, signal, SimpleChanges } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { EventDetailsBillsComponent } from '../event-details-bills/event-details-bills.component';
import { EventDetailsUsersComponent } from '../event-details-users/event-details-users.component';
import { EventDetailsSettlementsComponent } from '../event-details-settlements/event-details-settlements.component';
import { EventDetailsSettingsComponent } from '../event-details-settings/event-details-settings.component';
import { Event, EventDetails } from '../../../../core/models/events/event';
import { AppStateStore } from '../../../../core/store/app-state.store';

@Component({
  selector: 'app-event-details',
  imports: [
    CommonModule,
    MatTabsModule,
    EventDetailsBillsComponent,
    EventDetailsUsersComponent,
    EventDetailsSettlementsComponent,
    EventDetailsSettingsComponent,
  ],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss',
})
export class EventDetailsComponent implements OnInit, OnChanges {
  private readonly appStateStore = inject(AppStateStore);

  event = input.required<Event>();

  isMobile = input.required<boolean>();

  goBackEmit = output<void>();

  eventDetails = signal<EventDetails | null>(null);

  readonly userCurrency$ = this.appStateStore.userDefaultCurrency$;

  ngOnInit(): void {
    console.log('Selected event:', this.event());
    this.eventDetails.set(this.event());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['event']) {
      console.log('Event changed:', this.event());
    }
  }
}
