import { CommonModule } from '@angular/common';
import { Component, computed, input, OnInit, output, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DateTime } from 'luxon';
import { TimeRange } from '../../../core/models/time-range/time-range';
import { MatDatepickerModule, MatDateRangePicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-time-range-selector',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDatepickerModule],
  templateUrl: './time-range-selector.component.html',
  styleUrl: './time-range-selector.component.scss',
})
export class TimeRangeSelectorComponent implements OnInit {
  @ViewChild('picker') picker!: MatDateRangePicker<DateTime>;

  customRangeAllowed = input(false);
  initialTimeRange = input.required<TimeRange>();
  timeRangeChange = output<TimeRange>();

  timeRange = signal<TimeRange>({ from: DateTime.now(), to: DateTime.now() });

  label = computed(() => {
    const today = DateTime.now();
    const from = this.timeRange().from.startOf('day');
    const to = this.timeRange().to.startOf('day');

    const entireMonth = {
      from: from.startOf('month').toUnixInteger(),
      to: from.endOf('month').startOf('day').toUnixInteger(),
    };

    if (
      !this.customRangeAllowed() ||
      (from.toUnixInteger() === entireMonth.from && to.toUnixInteger() === entireMonth.to)
    ) {
      if (today.hasSame(from, 'year')) {
        return from.toFormat('LLLL');
      }

      return from.toFormat('LLLL yyyy');
    }

    const fromYear = today.hasSame(from, 'year') ? '' : from.toFormat('yyyy');
    const toYear = today.hasSame(to, 'year') ? '' : to.toFormat('yyyy');

    if (from.hasSame(to, 'day')) {
      return from.toFormat(`dd LLL ${fromYear}`);
    }

    return `${from.toFormat(`dd LLL ${fromYear}`)} - ${to.toFormat(`dd LLL ${toYear}`)}`;
  });

  ngOnInit() {
    this.timeRange.set({ from: this.initialTimeRange().from, to: this.initialTimeRange().to });
  }

  toggleFlyout() {
    if (!this.customRangeAllowed()) return;

    this.picker.open();
  }

  updateTimeRange(value: DateTime | null, type: 'from' | 'to') {
    if (!value) return;

    this.timeRange.update((prev) => ({
      ...prev,
      [type]: value,
    }));
  }

  prev() {
    this.timeRange.update((prev) => ({
      from: prev.from.minus({ months: 1 }).startOf('month'),
      to: prev.to.minus({ months: 1 }).endOf('month'),
    }));

    this.timeRangeChange.emit(this.timeRange());
  }

  next() {
    this.timeRange.update((prev) => ({
      from: prev.from.plus({ months: 1 }).startOf('month'),
      to: prev.to.plus({ months: 1 }).endOf('month'),
    }));

    this.timeRangeChange.emit(this.timeRange());
  }

  onPickerClose() {
    this.timeRangeChange.emit(this.timeRange());
  }
}
