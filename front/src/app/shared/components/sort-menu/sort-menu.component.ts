import { Component, input, model, output, signal, ViewChild } from '@angular/core';
import { SortItem } from '../../../core/models/sort/sort-item';
import { SortState } from '../../../core/models/sort/sort-state';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-sort-menu',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
  ],
  templateUrl: './sort-menu.component.html',
  styleUrl: './sort-menu.component.scss',
})
export class SortMenuComponent {
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;

  readonly options = input.required<SortItem[]>();

  readonly state = model<SortState>({
    value: 'name',
    direction: 'ASC',
  });

  readonly sortChange = output<SortState>();

  readonly menuPosition = signal<Record<string, string>>({});

  readonly localState = signal<SortState>({ ...this.state() });

  onMenuClosed(): void {
    this.localState.set({ ...this.state() });
  }

  onSortChange(): void {
    if (this.state().value !== this.localState().value || this.state().direction !== this.localState().direction) {
      this.state.set({ ...this.localState() });
      this.sortChange.emit(this.state());
    }

    this.menuTrigger.closeMenu();
  }

  changeDirection(e: MouseEvent | Event, val: boolean): void {
    e.stopImmediatePropagation();
    e.preventDefault();
    e.stopPropagation();

    this.localState.set({
      ...this.localState(),
      direction: val ? 'ASC' : 'DESC',
    });
  }
}
