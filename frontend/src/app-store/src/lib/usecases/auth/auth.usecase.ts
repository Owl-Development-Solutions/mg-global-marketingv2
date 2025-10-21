import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../data/store';

@Injectable({
  providedIn: 'root',
})
export class AuthUsecase {
  private store = inject(Store<fromStore.AuthState>);

  authProfile$ = this.store.pipe(select(fromStore.getAuthProfile));

  authLoading$ = this.store.pipe(select(fromStore.isLoading));

  authError$ = this.store.pipe(select(fromStore.authError));

  getAuthenticated$ = this.store.pipe(select(fromStore.getAuthenticated));

  //move this to user
  getAuthName$ = this.store.pipe(select(fromStore.getUserName));

  initiateAuth(data: { email: string; password: string }) {
    this.store.dispatch(fromStore.initiateAuthAttempted({ data }));
  }

  logout() {
    this.store.dispatch(fromStore.logoutAttempted());
  }
}
