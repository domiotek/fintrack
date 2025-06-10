import { Component, model, signal } from '@angular/core';
import { StatsOparationsItems, StatsOperationType } from '../../../../core/models/statistics/stats-operations';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-operation-type',
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, FormsModule],
  templateUrl: './select-operation-type.component.html',
  styleUrl: './select-operation-type.component.scss',
})
export class SelectOperationTypeComponent {
  selectedOparation = model.required<StatsOperationType>();

  operations = signal<{ label: string; value: StatsOperationType }[]>(StatsOparationsItems);
}
