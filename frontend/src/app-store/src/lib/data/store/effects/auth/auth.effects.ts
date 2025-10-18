import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthRepository } from '../../../repositories';
import * as fromAuth from '../../actions/auth/auth-actions';
import { catchError, map, switchMap, tap } from 'rxjs';
import { AuthUserResponse } from '../../../models';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authRepository = inject(AuthRepository);
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
            return [fromAuth.initiateAuthFailed({ data, error })];
          }),
        );
      }),
    );
  });

  navigateAfterSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromAuth.initiateSucceeded),
        tap(() => this.router.navigate(['dashboard'])),
      ),
    { dispatch: false },
  );
}
