import { Component, input } from '@angular/core';
import { AvatarComponent } from '../../../../components/avatar/avatar.component';

@Component({
  selector: 'app-typing-indicator',
  imports: [AvatarComponent],
  templateUrl: './typing-indicator.component.html',
  styleUrl: './typing-indicator.component.scss',
})
export class TypingIndicatorComponent {
  readonly typingUsers = input.required<string[]>();

  get users() {
    return this.typingUsers().slice(0, 3);
  }
}
