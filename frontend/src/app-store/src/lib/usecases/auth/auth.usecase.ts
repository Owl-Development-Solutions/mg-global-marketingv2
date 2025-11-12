import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../data/store';
import { Callbacks, RegisterData } from '../../data/models';
import { Observable } from 'rxjs';

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
  getUserId$ = this.store.pipe(select(fromStore.getUserid));
  getUserInfo$ = this.store.pipe(select(fromStore.getUserInfo));

  initiateAuth(data: { email: string; password: string }) {
    this.store.dispatch(fromStore.initiateAuthAttempted({ data }));
  }

  logout() {
    this.store.dispatch(fromStore.logoutAttempted());
  }

  registerUser(data: RegisterData, callBacks: Callbacks) {
    this.store.dispatch(
      fromStore.initiateRegisterUserAttempted({ data, callBacks }),
    );
  }
}
