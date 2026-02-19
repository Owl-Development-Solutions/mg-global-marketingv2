import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BreakpointObserverComponent } from '../../components';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterModule, CommonModule, MatIconModule],
  templateUrl: './auth.component.html',
})
export class AuthComponent extends BreakpointObserverComponent {}
