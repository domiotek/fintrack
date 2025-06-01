import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-details-settlements',
  imports: [],
  templateUrl: './event-details-settlements.component.html',
  styleUrl: './event-details-settlements.component.scss',
})
export class EventDetailsSettlementsComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
    console.log('EventDetailsSettlementsComponent initialized');
  }

  ngOnDestroy(): void {
    console.log('EventDetailsSettlementsComponent destroyed');
  }
}
