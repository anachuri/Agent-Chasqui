import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'como-funciona',
    loadComponent: () => import('./pages/how-it-works/how-it-works').then((m) => m.HowItWorks),
  },
  { path: '**', redirectTo: '' },
];
