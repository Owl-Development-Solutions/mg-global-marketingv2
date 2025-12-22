import {
  AfterViewInit,
  Component,
  inject,
  input,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatPrefix,
  MatSuffix,
} from '@angular/material/form-field';
import { RegisterFormGeneral } from 'projects/app/models/register-form.model';
import { formViewProvider } from 'projects/app/utils/form-view-provider';
import { MatInput } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
  MatOption,
} from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { PasswordMatchDirective } from 'projects/app/directives/password-match/password-match.directive';
import { UserUsecase } from '@app-store/lib/usecases';
import {
  catchError,
  concatMap,
  debounceTime,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import { UserData } from '@app-store/public-api';
import {
  MatAutocomplete,
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { UsernameSharedService } from 'projects/app/services';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-account-info-register',
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatFormField,
    FormsModule,
    MatLabel,
    MatInput,
    MatHint,
    MatNativeDateModule,
    MatSuffix,
    MatOption,
    MatSelectModule,
    CommonModule,
    PasswordMatchDirective,
    MatError,
    MatAutocompleteModule,
  ],
  viewProviders: [formViewProvider],
  providers: [provideNativeDateAdapter()],
  templateUrl: './account-info-register.component.html',
  styleUrl: './account-info-register.component.scss',
})
export class AccountInfoRegisterComponent implements AfterViewInit {
  constructor(private userService: UserService) {}
    // Call this after successful registration (e.g., after API success or on submit)
    saveUserInfo() {
      const userData = this.register();
      this.userService.setUser({
        firstName: userData.firstName,
        middleName: userData.middleName,
        lastName: userData.lastName,
        birthDate: userData.birthDate ? (typeof userData.birthDate === 'string' ? new Date(userData.birthDate) : userData.birthDate) : null,
        username: userData.username,
        email: userData.email,
        sponsor: userData.sponsor,
        upline: userData.upline,
        position: userData.position
      });
    }

    // Example: Call saveUserInfo() after registration (replace with your actual registration logic)
    onRegister() {
      // ... your registration logic (API call, validation, etc.)
      this.saveUserInfo();
    }
  private userUsecase = inject(UserUsecase);
  private userIdSharedService = inject(UsernameSharedService);

  group = input.required<string>();
  title = input.required<string>();
  register = input.required<RegisterFormGeneral>();

  opts = [
    { value: '[L]', name: 'Left' },
    { value: '[R]', name: 'Right' },
  ];

  @ViewChild('sponsor') sponsor!: NgModel;
  @ViewChild('upline') upline!: NgModel;

  filteredOptionSponsor$!: Observable<
    {
      label: string;
      value: string;
      userName: string;
      userId: string;
    }[]
  >;

  filteredOptionUpline$!: Observable<
    {
      label: string;
      value: string;
      userName: string;
      userId: string;
    }[]
  >;

  ngAfterViewInit(): void {
    this.filteredOptionSponsor$ = this.createFilteredOptions(this.sponsor);
    this.filteredOptionUpline$ = this.createFilteredOptions(this.upline);
  }

  private createFilteredOptions(
    model: NgModel,
  ): Observable<
    { label: string; value: string; userName: string; userId: string }[]
  > {
    return model.valueChanges!.pipe(
      startWith(''),
      debounceTime(250),
      concatMap((value) =>
        value && value.length >= 2 ? this.filterTypeAhead(value) : of([]),
      ),
    );
  }

  filterTypeAhead(
    value: string,
  ): Observable<
    { label: string; value: string; userName: string; userId: string }[]
  > {
    const find = typeof value === 'string' ? value : value;
    const filterValue = find.toLowerCase();

    return this.userUsecase.searchUserByName(filterValue).pipe(
      map((resp: UserData[]) => {
        return resp.map((i) => ({
          label: i.name,
          value: i.name,
          userName: i.userName!,
          userId: i.id,
        }));
      }),
    );
  }

  displaySponsor(
    option: { label: string; value: string; userId: string } | string,
  ): string {
    return typeof option === 'string' ? option : option?.label;
  }

  onSponsorSelected($event: MatAutocompleteSelectedEvent): void {
    const selectedOption = $event.option.value;
    const userId = selectedOption.userName;
    this.userIdSharedService.getUserSponsorUsername(userId);
  }

  displayUpline(
    option: { label: string; value: string; userId: string } | string,
  ): string {
    return typeof option === 'string' ? option : option?.label;
  }

  onUplineSelected($event: MatAutocompleteSelectedEvent): void {
    const selectedOption = $event.option.value;
    const userId = selectedOption.userName;
    this.userIdSharedService.getUserUplineUsername(userId);
  }
}
