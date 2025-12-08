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
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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
    MatRadioModule,
    CommonModule,
    FormsModule,
    MatRadioModule,
  ],
  templateUrl: './add-wallet-modal.component.html',
  styleUrl: './add-wallet-modal.component.scss',
})
export class AddWalletModalComponent {
  constructor(
    public dialogRef: MatDialogRef<AddWalletModalData>,
    @Inject(MAT_DIALOG_DATA) public data: AddWalletModalData,
  ) {}

  selectedPrice: string | null = null;

  priceOpts = [
    { price: '500.00', label: '500 Pesos' },
    { price: '1,000.00', label: '1,000 Pesos' },
    { price: '5,000.00', label: '5,000 Pesos' },
    { price: '10,000.00', label: '10,000 Pesos' },
    { price: '20,000.00', label: '20,000 Pesos' },
    { price: '50,000.00', label: '50,000 Pesos' },
    { price: '100,000.00', label: '100,000 Pesos' },
  ];

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

  performAddWallet(form: NgForm) {
    this.submitting$.next(true);
    const { price } = form.value;

    this.data.onSubmit({
      onSuccess: this.handleSuccess.bind(this),
      onFailure: this.handleError.bind(this),
      price: price,
    });
  }

  selectPrice(event: any) {
    // console.log(event.value);
  }
}
