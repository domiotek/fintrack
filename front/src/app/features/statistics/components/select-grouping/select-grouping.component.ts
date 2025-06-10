import { StatsGroupsItems, StatsGroupsType } from './../../../../core/models/statistics/stats-groups';
import { CommonModule } from '@angular/common';
import { Component, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-select-grouping',
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, FormsModule],
  templateUrl: './select-grouping.component.html',
  styleUrl: './select-grouping.component.scss',
})
export class SelectGroupingComponent {
  selectedGroup = model.required<StatsGroupsType>();

  groups = signal<{ label: string; value: StatsGroupsType }[]>(StatsGroupsItems);
}
