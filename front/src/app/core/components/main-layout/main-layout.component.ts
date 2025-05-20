import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { AppStateStore } from '../../store/app-state.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SideNavComponent, AsyncPipe],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnInit {
  private readonly appStateStore = inject(AppStateStore);

  private readonly componentRef = inject(DestroyRef);

  protected readonly userName$ = this.appStateStore.userName$;

  ngOnInit(): void {
    this.userName$.pipe(takeUntilDestroyed(this.componentRef)).subscribe();
  }
}
