import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthRepository, UserRepository } from '../../../repositories';
import * as fromAuth from '../../actions/auth/auth-actions';
import * as fromUser from '../../actions/user/user-actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthUserResponse, UserResponseModel } from '../../../models';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authRepository = inject(AuthRepository);
  private userRepository = inject(UserRepository);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  initiateAuthAttempted$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromAuth.initiateAuthAttempted),
      switchMap((action) => {
        const { data } = action;

        return this.authRepository.initiateAuth(data).pipe(
          map((data: UserResponseModel) =>
            fromAuth.initiateSucceeded({ data }),
          ),
          catchError((error) => {
            this.snackBar.open(error, 'x', {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 5 * 1000,
            });

            return of(fromAuth.initiateAuthFailed({ data, error }));
          }),
        );
      }),
    );
  });

  initiateUserRegisterAttempted$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromAuth.initiateRegisterUserAttempted),
      switchMap((action) => {
        const { data, callBacks } = action;

        return this.authRepository.registerUser(data).pipe(
          map((resp: string) => {
            callBacks.onSuccess();
            this.snackBar.open('User Registered Successfully', 'x', {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 5 * 1000,
            });
            return fromAuth.initiateRegisterUserSucceeded({ response: resp });
          }),
          catchError((error) => {
            const cleanMessage = error.message.replace('Error: ', '');
            callBacks.onFailure?.({ errorMsg: cleanMessage });
            this.snackBar.open(cleanMessage, 'x', {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 5 * 1000,
            });

            return of(fromAuth.initiateRegisterUserFailed({ error }));
          }),
        );
      }),
    );
  });

  navigateAfterSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromAuth.initiateSucceeded),
        tap(() => this.router.navigate(['/dashboard'])),
      ),
    { dispatch: false },
  );

  // initiateRefreshToken$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(fromUser.getUserByTokenSucceeded),
  //     switchMap((action) => {
  //       const { refreshToken, accessToken } = action.data;

  //       return this.authRepository.refreshToken(accessToken).pipe(
  //         map((data: AuthUserResponse) =>
  //           fromAuth.refreshTokenSucceed({ data }),
  //         ),
  //         catchError((error) => of(fromAuth.refreshTokenFailed({ error }))),
  //       );
  //     }),
  //   ),
  // );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromAuth.logoutAttempted),
        tap(() => {
          localStorage.clear();

          this.router.navigate(['/auth/credentials']);
        }),
      ),
    { dispatch: false },
  );
}
