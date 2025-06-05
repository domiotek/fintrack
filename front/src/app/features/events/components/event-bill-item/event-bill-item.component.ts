import { AfterViewInit, Component, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { Currency } from '../../../../core/models/currency/currency.model';
import { MatIconModule } from '@angular/material/icon';
import { EventBill } from '../../../../core/models/events/event-bill';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-event-bill-item',
  imports: [MatIconModule, MatTooltipModule],
  templateUrl: './event-bill-item.component.html',
  styleUrl: './event-bill-item.component.scss',
})
export class EventBillItemComponent implements AfterViewInit {
  private readonly elementRef = inject(ElementRef);

  middleContainer = viewChild<ElementRef>('middleContainer');

  rightContainer = viewChild<ElementRef>('rightContainer');

  bill = input.required<EventBill>();

  userCurrency = input.required<Currency>();

  billCurrency = input.required<Currency>();

  isMobile = input.required<boolean>();

  maxPaiderWidth = signal<number>(0);

  maxNameWidth = signal<number>(0);

  ngAfterViewInit(): void {
    const width = this.elementRef.nativeElement.offsetWidth;
    const middleContainerWidth = this.middleContainer()?.nativeElement.offsetWidth ?? 0;
    const rightContainerWidth = this.rightContainer()?.nativeElement.offsetWidth ?? 0;
    const sumMiddleRightContainerWidth = middleContainerWidth + rightContainerWidth;
    this.maxPaiderWidth.set(width - 84 - 54 - sumMiddleRightContainerWidth);
    this.maxNameWidth.set(width - 84 - sumMiddleRightContainerWidth);
  }

  protected isOverflowed(element: HTMLElement): boolean {
    return element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;
  }
}
