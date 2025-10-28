import { CommonModule, Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
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
import { AuthUsecase } from '@app-store/lib/usecases';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-auth-form',
  imports: [CommonModule, MatIcon, LoginComponent, SignUpComponent],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss',
})
export class AuthFormComponent extends BreakpointObserverComponent {
  private authRepository = inject(AuthUsecase);

  authProfile = toSignal(this.authRepository.authProfile$);
  authLoading = toSignal(this.authRepository.authLoading$);
  authError = toSignal(this.authRepository.authError$);

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

  switchToForgotPassword(data: string) {}

  switchToSignup(event: boolean) {
    if (event) {
      this.showSignUp = !this.showSignUp;
    }
  }

  switchToSignIn(event: boolean) {
    if (event) {
      this.showSignUp = !event;
    }
  }

  submitSignIn(data: NgForm) {
    const email = data.value?.email;
    const password = data.value?.password;
    if (data.value !== undefined) {
      this.authRepository.initiateAuth({ email, password });
    }
  }

  submitSignUp(data: NgForm) {
    console.log(data.value);
  }

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
}
