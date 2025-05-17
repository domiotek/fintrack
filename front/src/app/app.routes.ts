import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'remind-password',
    loadComponent: () =>
      import('./features/auth/pages/remind-password/remind-password.component').then((m) => m.RemindPasswordComponent),
  },
  {
    path: 'activate/:token',
    loadComponent: () => import('./features/auth/pages/activate/activate.component').then((m) => m.ActivateComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'stats',
    loadComponent: () =>
      import('./features/statistics/pages/statistics/statistics.component').then((m) => m.StatisticsComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/pages/settings/settings.component').then((m) => m.SettingsComponent),
  },
  {
    path: 'events',
    loadComponent: () => import('./features/events/pages/events/events.component').then((m) => m.EventsComponent),
  },
  {
    path: 'friends',
    loadComponent: () => import('./features/friends/pages/friends/friends.component').then((m) => m.FriendsComponent),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./features/categories/pages/categories/categories.component').then((m) => m.CategoriesComponent),
  },
];
