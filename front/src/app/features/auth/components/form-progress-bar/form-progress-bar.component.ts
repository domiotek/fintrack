import { Component, input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-form-progress-bar',
  imports: [MatProgressBarModule],
  templateUrl: './form-progress-bar.component.html',
  styleUrl: './form-progress-bar.component.scss',
})
export class FormProgressBarComponent {
  active = input<boolean>(false);
}
