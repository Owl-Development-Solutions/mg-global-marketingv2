import { NgModule } from '@angular/core';
import {
  AuthComponent,
  AuthFormComponent,
  DashboardComponent,
  EcuWalletComponent,
  GeonologyComponent,
  ShellComponent,
  LeadershipSupportComponent,
  UnilevelComponent,
} from './app/container';
import { RouterModule, Routes } from '@angular/router';

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
      {
        path: 'leadership-support',
        component: LeadershipSupportComponent,
      },
    ],
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: 'credentials',
        component: AuthFormComponent,
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
