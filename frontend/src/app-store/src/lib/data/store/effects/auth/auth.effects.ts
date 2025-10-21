import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthRepository, UserRepository } from '../../../repositories';
import * as fromAuth from '../../actions/auth/auth-actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthUserResponse } from '../../../models';
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
          map((data: AuthUserResponse) => fromAuth.initiateSucceeded({ data })),
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

  navigateAfterSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromAuth.initiateSucceeded),
        tap(() => this.router.navigate(['/dashboard'])),
      ),
    { dispatch: false },
  );

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
