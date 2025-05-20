import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from '../../../models/navigation/nav-item.model';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-nav-item',
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  templateUrl: './nav-item.component.html',
  styleUrl: './nav-item.component.scss',
})
export class NavItemComponent {
  item = input.required<NavItem>();

  itemClicked = output<void>();

  onClick(): void {
    this.itemClicked.emit();
  }
}
