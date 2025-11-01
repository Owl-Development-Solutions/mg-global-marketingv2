import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '../../data/store';
import { Observable } from 'rxjs';
import { UserData } from '../../data/models';
import { UserRepository } from '../../data/repositories';

@Injectable({
  providedIn: 'root',
})
export class UserUsecase {
  private store = inject(Store<fromStore.UserState>);
  private userRepo = inject(UserRepository);

  execute(userId: string) {
    this.store.dispatch(fromStore.getUserByIdAttempted({ userId }));
  }

  executeGetUsername(userName: string): Observable<string> {
    return this.userRepo.searchUserName(userName);
  }

  userNameExist(username: string): Observable<UserData[]> {
    return this.userRepo.userNameExist(username);
  }
}
