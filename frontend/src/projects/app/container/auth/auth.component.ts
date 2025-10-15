import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BreakpointObserverComponent } from '../../components';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  imports: [RouterModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent extends BreakpointObserverComponent {}
