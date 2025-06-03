import { Component, input } from '@angular/core';
import { EventSummary } from '../../../../core/models/events/event-summary';
import { Currency } from '../../../../core/models/currency/currency.model';

@Component({
  selector: 'app-event-bills-summary',
  imports: [],
  templateUrl: './event-bills-summary.component.html',
  styleUrl: './event-bills-summary.component.scss',
})
export class EventBillsSummaryComponent {
  summary = input.required<EventSummary>();

  eventCurrency = input.required<Currency>();

  userCurrency = input.required<Currency>();

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log('eventCurrency:', this.eventCurrency(), ' userCurrency:', this.userCurrency());
  }
}
