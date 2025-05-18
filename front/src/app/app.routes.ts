import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: '',
    loadComponent: () =>
      import('./features/auth/components/auth-layout/auth-layout.component').then((m) => m.AuthLayoutComponent),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/pages/login/login.component').then((m) => m.LoginComponent),
        canActivate: [authGuard],
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/pages/register/register.component').then((m) => m.RegisterComponent),
        canActivate: [authGuard],
      },
      {
        path: 'remind-password',
        loadComponent: () =>
          import('./features/auth/pages/remind-password/remind-password.component').then(
            (m) => m.RemindPasswordComponent,
          ),
        canActivate: [authGuard],
      },
      {
        path: 'activate/:token',
        loadComponent: () =>
          import('./features/auth/pages/activate/activate.component').then((m) => m.ActivateComponent),
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'stats',
    loadComponent: () =>
      import('./features/statistics/pages/statistics/statistics.component').then((m) => m.StatisticsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/pages/settings/settings.component').then((m) => m.SettingsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'events',
    loadComponent: () => import('./features/events/pages/events/events.component').then((m) => m.EventsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'friends',
    loadComponent: () => import('./features/friends/pages/friends/friends.component').then((m) => m.FriendsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./features/categories/pages/categories/categories.component').then((m) => m.CategoriesComponent),
    canActivate: [authGuard],
  },
];
