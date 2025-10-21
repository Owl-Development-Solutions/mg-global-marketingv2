import { inject, Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
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
