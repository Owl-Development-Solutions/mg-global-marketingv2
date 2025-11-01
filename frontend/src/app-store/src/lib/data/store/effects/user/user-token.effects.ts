import { inject, Injectable } from '@angular/core';
import { AuthRepository, UserRepository } from '../../../repositories';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromUser from '../../actions/user/user-actions';
import * as fromAuth from '../../actions/auth/auth-actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { AuthUserResponse, UserResponseModel } from '../../../models';

@Injectable()
export class UserTokenEffects {
  private actions$ = inject(Actions);
  private userRepository = inject(UserRepository);
  private authRepository = inject(AuthRepository);

  // getUserUponLogin$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(fromAuth.initiateSucceeded),
  //     switchMap((action) => {
  //       const { refreshToken, accessToken } = action.data;

  //       return this.userRepository.getUser(accessToken).pipe(
  //         map((data: UserResponseModel) =>
  //           fromUser.getUserByTokenSucceeded({ data }),
  //         ),
  //         catchError((error) => of(fromUser.getUserByTokenFailed({ error }))),
  //       );
  //     }),
  //   ),
  // );
}
