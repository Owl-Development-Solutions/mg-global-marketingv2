import { inject, Injectable } from '@angular/core';
import { UserRepository } from '../../../repositories';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromAuth from '../../actions/auth/auth-actions';
import { catchError, map, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private userRepository = inject(UserRepository);
  private snackBar = inject(MatSnackBar);

  initiateEditUserAttempted$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromAuth.updateUserProfileAttempted),
      switchMap((action) => {
        const { data, callBacks } = action;
        return this.userRepository.editUser(data).pipe(
          map(() => {
            callBacks.onSuccess();
            this.snackBar.open('Profile Updated Successfully', 'x', {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 5 * 1000,
            });
            return fromAuth.updateUserProfileSucceeded({ data });
          }),
          catchError((err) => {
            const cleanMessage = err.message.replace('Error: ', '');
            callBacks.onFailure?.({ errorMsg: cleanMessage });

            return [fromAuth.updateUserProfileFailed({ error: err })];
          }),
        );
      }),
    );
  });
}
