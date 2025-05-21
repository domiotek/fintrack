import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-alert-panel',
  imports: [CommonModule, MatIconModule],
  templateUrl: './alert-panel.component.html',
  styleUrl: './alert-panel.component.scss',
})
export class AlertPanelComponent {
  severity = input<'info' | 'error' | 'warning' | 'success'>('info');

  get icon() {
    switch (this.severity()) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'success':
        return 'check_circle';
      case 'info':
      default:
        return 'info';
    }
  }
}
