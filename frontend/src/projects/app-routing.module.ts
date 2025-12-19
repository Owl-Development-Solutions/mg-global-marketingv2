import { inject, NgModule } from '@angular/core';
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
import {
  AuthGuardFn,
  VerifyAuthenticatedGuardFn,
  GetGenealogyGuardFn,
} from './app/guards';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    canActivate: [AuthGuardFn],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'Dashboard',
      },
      {
        path: 'unilevel',
        component: UnilevelComponent,
        title: 'Unilevel',
      },
      {
        path: 'geonology/:user',
        canActivate: [GetGenealogyGuardFn],
        component: GeonologyComponent,
        title: 'Genealogy',
      },
      {
        path: 'ecu-wallet',
        component: EcuWalletComponent,
        title: 'NJ-Wallet',
      },
      {
        path: 'leadership-support',
        component: LeadershipSupportComponent,
        title: 'Leadership Supprt',
      },
    ],
  },
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [VerifyAuthenticatedGuardFn],
    children: [
      {
        path: 'credentials',
        component: AuthFormComponent,
        title: 'Auth',
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
