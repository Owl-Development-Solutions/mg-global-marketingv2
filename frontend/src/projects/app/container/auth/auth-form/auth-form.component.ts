import { CommonModule, Location } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { BreakpointObserverComponent } from '../../../components';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-auth-form',
  imports: [CommonModule, MatIcon],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss',
})
export class AuthFormComponent extends BreakpointObserverComponent {
  hasForgottenPassword: boolean = false;

  input = { email: '', password: '' };

  extraRouteData = signal(null) as any;

  constructor(
    override breakpointObserver: BreakpointObserver,
    protected location: Location,
  ) {
    super(breakpointObserver);

    const locationState = this.location.getState() as any;
    if (locationState?.navigationId > 1 && locationState?.name) {
      this.extraRouteData.set(this.location.getState() as any);
    }
  }
}
