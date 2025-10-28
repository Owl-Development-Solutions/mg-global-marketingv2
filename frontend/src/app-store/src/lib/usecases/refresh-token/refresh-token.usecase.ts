import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
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

  getRefreshToken = this.store.pipe(select(fromStore.getRefreshToken));

  execute(): Observable<string | undefined> {
    return this.store.select(fromStore.getRefreshToken);
  }
}
