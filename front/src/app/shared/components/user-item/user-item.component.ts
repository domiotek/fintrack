import { Component, input } from '@angular/core';
import { AvatarComponent } from '../avatar/avatar.component';
import { User } from '../../../core/models/user/user.model';

@Component({
  selector: 'app-user-item',
  imports: [AvatarComponent],
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.scss',
})
export class UserItemComponent {
  readonly item = input.required<User>();
  readonly showEmail = input<boolean>(false);
}
