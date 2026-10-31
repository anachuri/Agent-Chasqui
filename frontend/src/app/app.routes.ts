import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
    title: 'Chasqui Tech · Pagos en stablecoins',
  },
  { path: '**', redirectTo: '' },
];
