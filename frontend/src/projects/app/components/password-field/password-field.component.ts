import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgModel,
  ValidationErrors,
} from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { FormErrorPipe } from '../../pipes';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-field',
  imports: [
    FormErrorPipe,
    MatFormField,
    MatInput,
    MatLabel,
    MatIcon,
    FormsModule,
    MatError,
    CommonModule,
  ],
  templateUrl: './password-field.component.html',
  styleUrl: './password-field.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordFieldComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordFieldComponent implements ControlValueAccessor, OnChanges {
  @Input() isHandset: boolean = false;

  @Input() isDisabled: boolean = false;

  @Input() label: string = 'Password';

  @Input() name: string = 'password-field';

  @Input() error!: ValidationErrors;

  @Input() required: boolean = false;

  @Input() confirmFor?: string;

  @ViewChild(NgModel)
  private ngModel!: NgModel;

  @Output() sendPassword: EventEmitter<string> = new EventEmitter<string>();

  value!: string;

  hidePassword: boolean = true;

  onChange!: Function;

  onTouch!: Function;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['error'] && this.ngModel) {
      this.ngModel.control.setErrors(this.error);
    }

    if (changes['confirmFor'] && this.ngModel) {
      this.validateConfirmPassword();
    }
  }

  writeValue(value: string): void {
    if (value !== undefined) {
      this.value = value;
      this.validateConfirmPassword();
    }
  }

  get inputValue() {
    return this.value;
  }

  get mismatch(): any {
    return !!this.confirmFor && this.value && this.confirmFor !== this.value;
  }

  set inputValue(value) {
    this.value = value;
    this.validateConfirmPassword();
    this.onChange(this.value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  public resetField() {
    this.ngModel.control.markAsUntouched();
  }

  private validateConfirmPassword() {
    if (!this.ngModel) return;

    const control = this.ngModel.control;
    if (this.mismatch) {
      control.setErrors({ ...(control.errors ?? {}), mismatch: true });
    } else {
      if (control.errors?.['mismatch']) {
        const { mismatch, ...rest } = control.errors;
        control.setErrors(Object.keys(rest).length ? rest : null);
      }
    }
  }
}
