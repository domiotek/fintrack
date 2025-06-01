import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-details-settings',
  imports: [],
  templateUrl: './event-details-settings.component.html',
  styleUrl: './event-details-settings.component.scss',
})
export class EventDetailsSettingsComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
    console.log('EventDetailsSettingsComponent initialized');
  }

  ngOnDestroy(): void {
    console.log('EventDetailsSettingsComponent destroyed');
  }
}
