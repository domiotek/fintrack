import { CommonModule } from '@angular/common';
import { Component, input, model, output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-custom-list',
  imports: [CommonModule],
  templateUrl: './custom-list.component.html',
  styleUrl: './custom-list.component.scss',
})
export class CustomListComponent {
  items = input.required<any[]>();

  isSelectable = input<boolean>(false);

  itemTemplate = input.required<TemplateRef<any>>();

  selectedItem = model<any | null>(null);

  selectEmit = output<any>();

  onItemClick(item: any): void {
    if (this.isSelectable()) {
      this.selectedItem.set(item);
    }
    this.selectEmit.emit(item);
  }
}
