import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInput } from '@angular/material/input';
import { PasswordFieldComponent } from '../password-field/password-field.component';
import { SignInAttributes } from '../../models';
import { SubmitButtonComponent } from '../submit-button/submit-button.component';

@Component({
  selector: 'app-login',
  imports: [
    MatError,
    MatLabel,
    MatProgressSpinnerModule,
    CommonModule,
    FormsModule,
    MatFormField,
    MatInput,
    PasswordFieldComponent,
    MatInput,
    SubmitButtonComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  authLoading = input<boolean>();

  authError = input<string | undefined | null>();

  @Input() input!: SignInAttributes;

  @Input() isHandset!: boolean;

  @Input() loading = false;

  @Output() submit = new EventEmitter<NgForm>();

  @Output() signUp = new EventEmitter<boolean>();

  login(data: NgForm) {
    this.submit.emit(data);
  }

  forgottenPassword(data: any) {
    // TODO TO BE IMPLIMENTED
    console.log(data);
  }

  signUpHere() {
    this.signUp.emit(true);
  }
}
