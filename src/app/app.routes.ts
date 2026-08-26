import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
    title: 'Giriş Yap',
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/dashboard/dashboard').then((m) => m.Dashboard),
        title: 'Dashboard',
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/users/users').then((m) => m.Users),
        title: 'Kullanıcılar',
      },
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found').then((m) => m.NotFound),
    title: 'Sayfa Bulunamadı',
  },
];
