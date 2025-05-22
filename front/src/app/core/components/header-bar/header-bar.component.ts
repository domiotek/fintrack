import { Component, input } from '@angular/core';

@Component({
  selector: 'app-header-bar',
  imports: [],
  templateUrl: './header-bar.component.html',
  styleUrl: './header-bar.component.scss',
})
export class HeaderBarComponent {
  title = input.required<string>();
}
