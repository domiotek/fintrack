import { Component, input, output } from '@angular/core';
import { NoSelectedComponent } from '../../../../shared/components/no-selected/no-selected.component';
import { Chat } from '../../../../core/models/chat/chat.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { ChatComponent } from '../../../../shared/controls/chat/chat.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-chat-container',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NoSelectedComponent,
    AvatarComponent,
    ChatComponent,
  ],
  templateUrl: './chat-container.component.html',
  styleUrl: './chat-container.component.scss',
})
export class ChatContainerComponent {
  readonly visible = input<boolean>(false);
  readonly chat = input<Chat | null>(null);
  readonly isMobile = input<boolean>(false);

  readonly goBackEmit = output<void>();

  onGoBack(): void {
    this.goBackEmit.emit();
  }
}
