import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '../../data/store';
import {
  Observable,
  of,
  throwError,
  switchMap,
  map,
  catchError,
  take,
} from 'rxjs';
import { AuthRepository } from '../../data/repositories';

@Injectable({
  providedIn: 'root',
})
export class RefreshTokenUsecase {
  private store = inject(Store<fromStore.AuthState>);
  private authRepository = inject(AuthRepository);

  // execute(): Observable<string | undefined> {
  //   return this.store.select(fromStore.selectRefreshToken).pipe(
  //     take(1),
  //     switchMap((refreshToken) => {
  //       if (!refreshToken) {
  //         return throwError(() => new Error('No refresh token found'));
  //       }

  //       return this.authRepository.refreshToken(refreshToken).pipe(
  //         map((response) => {
  //           console.log(`response`, response);

  //           this.store.dispatch(
  //             fromStore.refreshTokenSucceed({ data: response }),
  //           );

  //           return response.accessToken;
  //         }),
  //         catchError((error) => {
  //           return throwError(() => error);
  //         }),
  //       );
  //     }),
  //   );
  // }
}
