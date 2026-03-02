import { Component, Inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {
  MatButton,
  MatIconButton,
  MatMiniFabButton,
} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import {
  MatError,
  MatFormField,
  MatHint,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { SubmitButtonComponent } from '../submit-button/submit-button.component';
import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
import {
  CallbackOnFailureModel,
  ErrorProps,
  User,
} from '@app-store/public-api';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatSuffix,
} from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatNativeDateModule,
  MatOption,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { BehaviorSubject } from 'rxjs';

export interface AccountModalData {
  userProfile: User;
  fullName: {
    firstName: string;
    lastName: string;
  };
  onSubmit: ({
    data,
    onSuccess,
    onFailure,
  }: {
    data: any;
    onSuccess: Function;
    onFailure: Function;
  }) => void;
}

@Component({
  selector: 'app-account-modal',
  imports: [
    DatePipe,
    MatDialogContent,
    MatDialogActions,
    MatIcon,
    MatButton,
    MatIconButton,
    MatInput,
    MatError,
    FormsModule,
    MatFormField,
    MatHint,
    SubmitButtonComponent,
    CommonModule,
    MatMiniFabButton,
    MatLabel,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSuffix,
    MatSelectModule,
  ],
  templateUrl: './account-modal.component.html',
  styleUrl: './account-modal.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class AccountModalComponent {
  constructor(
    public dialogRef: MatDialogRef<AccountModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AccountModalData,
  ) {}

  isEditMode = signal<boolean>(false);
  imagePreview = signal<boolean>(false);

  submitting$ = new BehaviorSubject<boolean>(false);

  error$ = new BehaviorSubject<ErrorProps | null>(null);

  enableEditMode() {
    this.isEditMode.update((v) => !v);
  }

  triggerImageUpload() {}

  onImageSelected(event: any) {
    // @TODO
  }

  onCancelClick() {
    if (!this.submitting$.getValue()) {
      this.dialogRef.close();
    }
  }

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

  performEditUserProfile(form: NgForm) {
    if (form.valid) {
      this.data.onSubmit({
        onSuccess: this.handleSuccess.bind(this),
        onFailure: this.handleError.bind(this),
        data: form.value,
      });
    }
  }
}
