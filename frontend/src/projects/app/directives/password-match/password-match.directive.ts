import { Directive, forwardRef } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[appPasswordMatch]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PasswordMatchDirective),
      multi: true,
    },
  ],
})
export class PasswordMatchDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    if (!control || !(control as any).controls) return null;

    const group = control as any;
    const passwordNgModel = group.controls['password'];
    const confirmPasswordNgModel = group.controls['cPassword'];

    if (!passwordNgModel || !confirmPasswordNgModel) return null;

    const password = passwordNgModel?.value;
    const confirmPassword = confirmPasswordNgModel?.value;

    if (confirmPassword && password !== confirmPassword) {
      confirmPasswordNgModel.setErrors({
        ...confirmPasswordNgModel.errors,
        mismatch: true,
      });
      return { mismatch: true };
    } else {
      if (confirmPasswordNgModel.hasError('mismatch')) {
        const errors = { ...confirmPasswordNgModel.errors };
        delete errors['mismatch'];
        confirmPasswordNgModel.setErrors(
          Object.keys(errors).length ? errors : null,
        );
      }
    }

    //added for email validator
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailNgModel = group.controls['email'];
    const email = emailNgModel?.value;

    if (!emailRegex.test(email)) {
      emailNgModel.setErrors({
        ...emailNgModel.errors,
        email: true,
      });

      return { email: true };
    } else {
      if (emailNgModel.hasError('email')) {
        const errors = { ...emailNgModel.errors };
        delete errors['email'];
        emailNgModel.setErrors(Object.keys(errors).length ? errors : null);
      }
    }

    return null;
  }

  constructor() {}
}
