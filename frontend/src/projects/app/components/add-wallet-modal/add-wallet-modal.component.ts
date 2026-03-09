import { Component, Inject } from '@angular/core';
import {
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatAnchor } from '@angular/material/button';
import { SubmitButtonComponent } from '../submit-button/submit-button.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { CallbackOnFailureModel, ErrorProps } from '@app-store/public-api';

export interface AddWalletModalData {
  price: string;
  onSubmit: ({
    price,
    onSuccess,
    onFailure,
  }: {
    price: string;
    onSuccess: Function;
    onFailure: Function;
  }) => void;
}

@Component({
  selector: 'app-add-wallet-modal',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatAnchor,
    MatDialogClose,
    SubmitButtonComponent,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './add-wallet-modal.component.html',
  styleUrl: './add-wallet-modal.component.scss',
})
export class AddWalletModalComponent {
  constructor(
    public dialogRef: MatDialogRef<AddWalletModalData>,
    @Inject(MAT_DIALOG_DATA) public data: AddWalletModalData,
  ) {}

  customAmount: number | null = null;

  submitting$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<ErrorProps | null>(null);

  // Minimum amount validation
  MIN_AMOUNT = 500;

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

  performAddWallet(form: NgForm) {
    this.submitting$.next(true);
    const amount = this.customAmount || 0;

    // Validate minimum amount
    if (amount < this.MIN_AMOUNT) {
      this.handleError({
        errorMsg: `Minimum amount is ${this.MIN_AMOUNT} pesos. Please enter an amount of ${this.MIN_AMOUNT} or more.`
      });
      return;
    }

    this.data.onSubmit({
      onSuccess: this.handleSuccess.bind(this),
      onFailure: this.handleError.bind(this),
      price: amount.toString(),
    });
  }
}
