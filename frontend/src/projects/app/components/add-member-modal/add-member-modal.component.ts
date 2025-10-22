import { Component, Inject, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { GeonologyUsecase } from '@app-store/lib/usecases';
import { BehaviorSubject } from 'rxjs';
import {
  CallbackOnFailureModel,
  ErrorProps,
  GeonologyNode,
} from '@app-store/public-api';
import { FormsModule, NgForm } from '@angular/forms';
import { SubmitButtonComponent } from '../submit-button/submit-button.component';
import { CommonModule } from '@angular/common';

export interface AddMemberModalData {
  data: any;
  side: string;
  onSubmit: ({
    data,
    onSuccess,
    onFailure,
  }: {
    data: any;
    side: any;
    onSuccess: Function;
    onFailure: Function;
  }) => void;
}

@Component({
  selector: 'app-add-member-modal',
  imports: [
    MatInputModule,
    MatIcon,
    MatDialogModule,
    MatCardModule,
    MatFormField,
    MatLabel,
    MatButtonModule,
    FormsModule,
    SubmitButtonComponent,
    CommonModule,
  ],
  templateUrl: './add-member-modal.component.html',
  styleUrl: './add-member-modal.component.scss',
})
export class AddMemberModalComponent {
  constructor(
    public dialogRef: MatDialogRef<AddMemberModalComponent>,
    private geonologyUsecase: GeonologyUsecase,
    @Inject(MAT_DIALOG_DATA) public data: AddMemberModalData,
  ) {}

  addNewMemberInputProps = {
    firstName: '',
    lastName: '',
    userName: '',
    activationCode: '',
  };

  submitting$ = new BehaviorSubject<boolean>(false);

  error$ = new BehaviorSubject<ErrorProps | null>(null);

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

  performAddMember(form: NgForm) {
    console.log(form.value);
    console.log();

    const { firstName, lastName, userName, activationCode } = form.value;
    const side = this.data.side;

    const newNode: GeonologyNode = {
      userName: userName,
      firstName: firstName,
      lastName: lastName,
      balance: 0,
      leftPoints: 0,
      rightPoints: 0,
      leftDownline: 0,
      rightDownline: 0,
      rankPoints: 1,
      level: { low: 1, high: 0 },
      side: side === 'left' ? '[L]' : '[R]',
      hasDeduction: false,
    };

    this.geonologyUsecase.addUserGeonology({
      parentUserName: this.data.data.userName,
      side: this.data.side,
      child: newNode,
    });

    this.dialogRef.close();

    // if (form.valid) {
    //   this.submitting$.next(true);
    //   this.error$.next(null);
    //   this.data.onSubmit({
    //     data: {
    //       ...form.value
    //     },

    //   })
    // }
  }
}
