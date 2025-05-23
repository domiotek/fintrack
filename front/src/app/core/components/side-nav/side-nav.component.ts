import { AfterViewInit, Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { BreakpointObserver } from '@angular/cdk/layout';
import { filter, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ROUTE_TITLES } from '../../constants/navigation/route-titles';
import { NavigationEnd, Router } from '@angular/router';
import { NavItem } from '../../models/navigation/nav-item.model';
import { NAV_HEADERS, SETTINGS_ITEM } from '../../constants/navigation/headers';
import { AuthService } from '../../services/auth/auth.service';
import { NavItemComponent } from './nav-item/nav-item.component';
import { HeaderBarComponent } from '../header-bar/header-bar.component';

@Component({
  selector: 'app-side-nav',
  imports: [
    CommonModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    NavItemComponent,
    HeaderBarComponent,
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent implements OnInit, AfterViewInit {
  private readonly router = inject(Router);

  private readonly observer = inject(BreakpointObserver);

  private readonly destroyRef = inject(DestroyRef);

  private readonly authService = inject(AuthService);

  readonly userName = input.required<string | null>();

  protected readonly navItems = signal<NavItem[]>(NAV_HEADERS);

  protected readonly isMobile = signal<boolean>(false);

  protected readonly isCollapsed = signal<boolean>(false);

  protected readonly isOpened = computed(() => (this.isMobile() ? !this.isCollapsed() : true));

  protected readonly navWidth = computed(() => (this.isCollapsed() ? '56px' : '240px'));

  protected readonly contentMargin = computed(() => (this.isMobile() ? '0px' : this.navWidth()));

  protected readonly settingsItem: NavItem = SETTINGS_ITEM;

  protected readonly pageTitle = signal<string>('');

  ngOnInit(): void {
    this.observer
      .observe('(max-width: 768px)')
      .pipe(
        tap((res) => {
          this.isMobile.set(res.matches);
          this.isCollapsed.set(res.matches);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        tap((e: NavigationEnd) => {
          this.handleDashboardTitle(e.url.slice(1));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.pageTitle.set(ROUTE_TITLES[this.router.url.slice(1)]);
  }

  ngAfterViewInit(): void {
    this.handleDashboardTitle(this.router.url.slice(1));
  }

  protected toggleMenu(): void {
    this.isCollapsed.set(!this.isCollapsed());
  }

  protected onItemClicked(): void {
    if (this.isMobile()) {
      this.toggleMenu();
    }
  }

  protected logout(): void {
    this.authService
      .logout()
      .pipe(
        tap(() => {
          this.router.navigate(['login']);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private handleDashboardTitle(url: string): void {
    this.pageTitle.set(url === 'dashboard' ? `${ROUTE_TITLES[url]}, ${this.userName()}` : ROUTE_TITLES[url]);
  }
}
