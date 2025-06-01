import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-details-users',
  imports: [],
  templateUrl: './event-details-users.component.html',
  styleUrl: './event-details-users.component.scss',
})
export class EventDetailsUsersComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
    console.log('EventDetailsUsersComponent initialized');
  }

  ngOnDestroy(): void {
    console.log('EventDetailsUsersComponent destroyed');
  }
}
