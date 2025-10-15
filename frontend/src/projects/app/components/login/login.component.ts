import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  input,
  NgModule,
  Output,
} from '@angular/core';
import { FormControl, FormsModule, NgForm, NgModel } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInput } from '@angular/material/input';
import { PasswordFieldComponent } from '../password-field/password-field.component';
import { MatButton } from '@angular/material/button';
import { NotificationComponent } from '../notification/notification.component';

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
    MatButton,
    NotificationComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  @Input() input: any;

  @Input() error!: string | null;

  @Input() isHandse!: boolean;

  @Input() loading = false;

  @Output() submit = new EventEmitter<NgForm>();

  login(data: any) {
    console.log(data);
  }

  forgottenPassword(data: any) {
    console.log(data);
  }
}
