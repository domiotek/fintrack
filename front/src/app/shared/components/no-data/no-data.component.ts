import { Component, input } from '@angular/core';

@Component({
  selector: 'app-no-data',
  imports: [],
  templateUrl: './no-data.component.html',
  styleUrl: './no-data.component.scss',
})
export class NoDataComponent {
  noDataMessage = input<string>('Brak danych do wyświetlenia');
}
