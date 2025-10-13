import {
  DashboardComponent,
  EcuWalletComponent,
  GeonologyComponent,
  ShellComponent,
  UnilevelComponent,
} from './container';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'unilevel',
        component: UnilevelComponent,
      },
      {
        path: 'geonology',
        component: GeonologyComponent,
      },
      {
        path: 'ecu-wallet',
        component: EcuWalletComponent,
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
