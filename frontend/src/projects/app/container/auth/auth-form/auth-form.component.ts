import { CommonModule, Location } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  BreakpointObserverComponent,
  LoginComponent,
  SignUpComponent,
} from '../../../components';
import { BreakpointObserver } from '@angular/cdk/layout';
import { SignInAttributes, SignUpAttributes } from '../../../models';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth-form',
  imports: [CommonModule, MatIcon, LoginComponent, SignUpComponent],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss',
})
export class AuthFormComponent extends BreakpointObserverComponent {
  hasForgottenPassword: boolean = false;
  showSignUp: boolean = false;

  inputSignIn: SignInAttributes = { email: '', password: '' };

  inputSignUp: SignUpAttributes = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  extraRouteData = signal(null) as any;

  constructor(
    override breakpointObserver: BreakpointObserver,
    private router: Router,
    protected location: Location,
  ) {
    super(breakpointObserver);

    const locationState = this.location.getState() as any;
    if (locationState?.navigationId > 1 && locationState?.name) {
      this.extraRouteData.set(this.location.getState() as any);
    }
  }

  switchToForgotPassword(data: string) {}

  switchToSignup(event: boolean) {
    if (event) {
      this.showSignUp = !this.showSignUp;
    }
  }

  switchToSignIn(event: boolean) {
    console.log(event);

    if (event) {
      this.showSignUp = !event;
    }
  }

  submitSignIn(data: NgForm) {
    console.log(data.value);
  }

  submitSignUp(data: NgForm) {
    console.log(data.value);
  }
}
