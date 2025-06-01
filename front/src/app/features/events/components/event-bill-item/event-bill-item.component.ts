import { Component, input } from '@angular/core';
import { Currency } from '../../../../core/models/currency/currency.model';
import { MatIconModule } from '@angular/material/icon';
import { EventBill } from '../../../../core/models/events/event-bill';

@Component({
  selector: 'app-event-bill-item',
  imports: [MatIconModule],
  templateUrl: './event-bill-item.component.html',
  styleUrl: './event-bill-item.component.scss',
})
export class EventBillItemComponent {
  bill = input.required<EventBill>();

  userCurrency = input.required<Currency>();

  billCurrency = input.required<Currency>();
}
