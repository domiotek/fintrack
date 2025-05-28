import { Component, input } from '@angular/core';

@Component({
  selector: 'app-no-selected',
  imports: [],
  templateUrl: './no-selected.component.html',
  styleUrl: './no-selected.component.scss',
})
export class NoSelectedComponent {
  placeholder = input.required<string>();
}
