import {
  AfterViewInit,
  Component,
  Inject,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  map,
  Observable,
  of,
  skip,
  startWith,
  switchMap,
} from 'rxjs';
import {
  CallbackOnFailureModel,
  ErrorProps,
  GeonologyNode,
  UserData,
} from '@app-store/public-api';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { SubmitButtonComponent } from '../submit-button/submit-button.component';
import { CommonModule } from '@angular/common';
import { UserUsecase } from '@app-store/lib/usecases';
import { ActivationCodeUsecase } from '@app-store/lib/usecases/activation-code/activation-code.usecase';
import { activationCodeValidValidator } from 'projects/app/helpers/activation-code.validator';
import { usernameAvailableValidator } from 'projects/app/helpers/search-user.validator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NotificationComponent } from '../notification/notification.component';

export interface AddMemberModalData {
  data: GeonologyNode;
  rootUsername: string | null | undefined;
  side: string;
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

export type CheckResultResp =
  | { isAvailable: true; message: string }
  | { isAvailable: false; message: string };

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
    MatAutocompleteModule,
    NotificationComponent,
  ],
  templateUrl: './add-member-modal.component.html',
})
export class AddMemberModalComponent implements AfterViewInit {
  constructor(
    public dialogRef: MatDialogRef<AddMemberModalComponent>,
    private userUsecase: UserUsecase,
    private activationCodeUsecase: ActivationCodeUsecase,
    @Inject(MAT_DIALOG_DATA) public data: AddMemberModalData,
  ) {}

  filteredUsernameOpts!: {
    label: string;
    value: string;
    userId: string;
  };

  addNewMemberInputProps = {
    firstName: '',
    lastName: '',
    userName: '',
    activationCode: '',
    sponsorUsername: '',
  };

  submitting$ = new BehaviorSubject<boolean>(false);

  error$ = new BehaviorSubject<ErrorProps | null>(null);

  isRootUsernameNotFound: boolean = false;

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
    this.submitting$.next(true);
    const { firstName, lastName, userName, activationCode, rootUsername } =
      form.value;
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

    const data = {
      parentUserName: this.data.data.userName,
      side: side === 'left' ? '[L]' : '[R]',
      child: newNode,
      sponsorUsername: rootUsername,
      activationCodeId: activationCode,
    };

    this.data.onSubmit({
      onSuccess: this.handleSuccess.bind(this),
      onFailure: this.handleError.bind(this),
      data: data,
    });
  }

  @ViewChild('userName') userName!: NgModel;
  @ViewChild('activationCode') activationCode!: NgModel;
  @ViewChild('rootUsername') rootUsername!: NgModel;
  filteredOptions$!: Observable<CheckResultResp>;
  filteredOptionsForActivationCode$!: Observable<CheckResultResp>;
  filteredRootUsername$!:
    | Observable<
        | {
            label: string;
            value: string;
            userId: string;
          }[]
        | null
      >
    | undefined;

  ngAfterViewInit(): void {
    this.userName.control.setAsyncValidators(
      usernameAvailableValidator(this.userUsecase, 4),
    );

    this.userName.control.updateValueAndValidity();

    this.activationCode.control.setAsyncValidators(
      activationCodeValidValidator(this.activationCodeUsecase, 8),
    );
    this.activationCode.control.updateValueAndValidity();

    //activation-code
    this.activationCode.valueChanges?.pipe(
      switchMap(() => {
        const control = this.activationCode.control;

        if (control.pending) {
          return of({ status: 'Checking...' });
        }

        if (control.valid && control.value && control.value.length >= 8) {
          return of({
            isAvailable: true,
            message: 'Activation code is valid!',
          });
        }

        return of({ inactive: true });
      }),
    ) as Observable<any>;

    //username
    this.userName.valueChanges?.pipe(
      switchMap(() => {
        const control = this.userName.control;

        if (control.pending) {
          return of({ status: 'checking...' });
        }

        if (control.valid && control.value && control.value.length >= 3) {
          return of({ isAvailable: true, message: 'Username is available!' });
        }

        // Otherwise, don't show a positive message
        return of({ inactive: true });
      }),
    ) as Observable<any>;

    //rootusername
    this.rootUsername.valueChanges?.pipe(
      switchMap(() => {
        const control = this.rootUsername.control;
        if (control.valid && control.value && control.value.length >= 3) {
          return of({
            isAvailable: true,
            message: 'Sponsor username found!',
          });
        }

        return of({ inactive: true });
      }),
    ) as Observable<any>;

    this.filteredOptionsForActivationCode$ =
      this.activationCode.valueChanges?.pipe(
        startWith(''),
        debounceTime(250),
        switchMap((value) => {
          if (value && value.length > 3) {
            return this.filterCode(value);
          }
          return of({ inactive: true });
        }),
      ) as Observable<CheckResultResp>;

    this.filteredOptions$ = this.userName.valueChanges?.pipe(
      startWith(''),
      debounceTime(250),
      switchMap((value) => {
        if (value && value.length > 3) {
          return this.filterName(value);
        }
        return of({ inactive: true });
      }),
    ) as Observable<CheckResultResp>;
    this.filteredRootUsername$ = this.rootUsername.valueChanges?.pipe(
      skip(1),
      debounceTime(250),
      switchMap((value: any) => {
        if (value && value.length) {
          return this.filterTypeAhead(value);
        }

        return of(null);
      }),
    );
  }

  private filterName(value: string | any): Observable<CheckResultResp> {
    const find = typeof value === 'string' ? value : value;
    const filterValue = find.toLowerCase();

    return this.userUsecase.executeGetUsername(filterValue).pipe(
      map((successMessage: string) => {
        return {
          isAvailable: true,
          message: successMessage,
        } as CheckResultResp;
      }),
      catchError((error) => {
        return of({
          isAvailable: false,
          message: error.error || error.message || 'Unknown error.',
        } as CheckResultResp);
      }),
    );
  }

  private filterCode(value: string | any): Observable<CheckResultResp> {
    const find = typeof value === 'string' ? value : value;
    const filterValue = find.toLowerCase();

    return this.activationCodeUsecase.searchActivationCode(filterValue).pipe(
      map((successMessage: string) => {
        return {
          isAvailable: true,
          message: successMessage,
        } as CheckResultResp;
      }),
      catchError((error) => {
        return of({
          isAvailable: false,
          message: error.error || error.message || 'Unknown error.',
        } as CheckResultResp);
      }),
    );
  }

  filterTypeAhead(
    value: string,
  ): Observable<{ label: string; value: string; userId: string }[]> {
    const find = typeof value === 'string' ? value : value;
    const filterValue = find.toLowerCase();
    return this.userUsecase.userNameExist(filterValue).pipe(
      map((resp: UserData[]) => {
        return resp.map((i) => ({
          label: i.userName!,
          value: i.userName!,
          userId: i.id,
        }));
      }),

      catchError((error) => {
        return of([]);
      }),
    );
  }
}
