import { Component, input } from '@angular/core';

@Component({
  selector: 'app-error-holder',
  imports: [],
  templateUrl: './error-holder.component.html',
  styleUrl: './error-holder.component.scss',
})
export class ErrorHolderComponent {
  visible = input(false);
}
