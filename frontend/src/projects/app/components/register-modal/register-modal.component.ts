import { BreakpointObserver } from '@angular/cdk/layout';
import {
  Component,
  Inject,
  inject,
  OnDestroy,
  Signal,
  ViewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import {
  MatDialogContent,
  MatDialogActions,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  MatStepper,
  MatStepperModule,
  StepperOrientation,
} from '@angular/material/stepper';
import { BehaviorSubject, map } from 'rxjs';
import { AccountInfoRegisterComponent } from '../account-info-register/account-info-register.component';
import {
  ActivationCode,
  ActivationCodeEmpty,
  RegisterEmptyForm,
  RegisterFormGeneral,
} from 'projects/app/models/register-form.model';
import { CdkStepperModule, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RegisterConfirmationComponent } from '../register-confirmation/register-confirmation.component';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { SubmitButtonComponent } from '../submit-button/submit-button.component';
import { CallbackOnFailureModel, ErrorProps } from '@app-store/public-api';
import { CommonModule } from '@angular/common';

export interface RegisterModalData {
  registerApplicantForm: RegisterFormGeneral;
  activationCodeForm: ActivationCode;
  onSubmit: ({
    registerApplicantForm,
    activationCodeForm,
    onSuccess,
    onFailure,
  }: {
    registerApplicantForm: RegisterFormGeneral;
    activationCodeForm: ActivationCode;
    onSuccess: Function;
    onFailure: Function;
  }) => void;
}

@Component({
  selector: 'app-register-modal',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatStepperModule,
    FormsModule,
    AccountInfoRegisterComponent,
    MatAnchor,
    MatIcon,
    RegisterConfirmationComponent,
    MatFormField,
    MatLabel,
    MatHint,
    MatInput,
    SubmitButtonComponent,
    CommonModule,
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.scss',
})
export class RegisterModalComponent implements OnDestroy {
  private breakPointObserver = inject(BreakpointObserver);

  constructor(
    public dialogRef: MatDialogRef<RegisterModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RegisterModalData,
  ) {
    this.data = {
      registerApplicantForm: data?.registerApplicantForm ?? {
        ...RegisterEmptyForm,
      },
      activationCodeForm: data?.activationCodeForm ?? {
        ...ActivationCodeEmpty,
      },
      onSubmit: data?.onSubmit,
    } as RegisterModalData;
  }

  @ViewChild('stepper') stepper!: MatStepper;

  stepperOrientation: Signal<StepperOrientation> = toSignal(
    this.breakPointObserver
      .observe('(min-width: 900px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical'))),
    { initialValue: 'horizontal' },
  );

  submitting$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<ErrorProps | null>(null);

  handleSuccess() {
    this.submitting$.next(false);
    this.error$.next(null);
    this.dialogRef.close();
  }

  handleError(error: CallbackOnFailureModel) {
    this.submitting$.next(false);
    this.error$.next({
      title: 'Error',
      errorType: 'error',
      message: error.errorMsg,
      showClose: false,
    });
  }

  editForm(event: any) {
    this.stepper.selectedIndex = 0;
  }

  collectFormData(accountInfo: NgForm, activationInfo: NgForm) {
    if (accountInfo.invalid || activationInfo.invalid) {
      accountInfo.control.markAllAsTouched();
      activationInfo.control.markAllAsTouched();
      return;
    }

    this.submitting$.next(true);

    const registerApplicant = this.data.registerApplicantForm;
    const activationCode = this.data.activationCodeForm;

    this.data.onSubmit({
      onSuccess: this.handleSuccess.bind(this),
      onFailure: this.handleError.bind(this),
      registerApplicantForm: registerApplicant,
      activationCodeForm: activationCode,
    });
  }

  ngOnDestroy(): void {
    this.data.registerApplicantForm = { ...RegisterEmptyForm };
    this.data.activationCodeForm = { ...ActivationCodeEmpty };
  }
}
