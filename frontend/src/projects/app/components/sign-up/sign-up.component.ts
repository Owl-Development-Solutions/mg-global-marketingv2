import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PasswordFieldComponent } from '../password-field/password-field.component';
import { MatButton } from '@angular/material/button';
import { NotificationComponent } from '../notification/notification.component';
import { SignUpAttributes } from '../../models';

@Component({
  selector: 'app-sign-up',
  imports: [
    MatError,
    MatLabel,
    MatProgressSpinnerModule,
    CommonModule,
    FormsModule,
    MatFormField,
    MatInput,
    PasswordFieldComponent,
    MatButton,
    NotificationComponent,
    MatInput,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  @Input() error!: string | null;

  @Input() isHandset!: boolean;

  @Input() signUpInput!: SignUpAttributes;

  @Output() handleSubmit = new EventEmitter<NgForm>();

  @Output() signIn = new EventEmitter<boolean>();

  passwordMismatch = false;

  checkPasswordsMatch() {
    this.passwordMismatch =
      this.signUpInput.password !== this.signUpInput.confirmPassword;
  }

  signUp(form: NgForm) {
    this.handleSubmit.emit(form);
  }

  clickSignIn() {
    this.signIn.emit(true);
  }
}
