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
}
