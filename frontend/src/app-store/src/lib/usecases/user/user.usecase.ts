import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '../../data/store';

@Injectable({
  providedIn: 'root',
})
export class UserUsecase {
  private store = inject(Store<fromStore.UserState>);

  execute(userId: string) {
    this.store.dispatch(fromStore.getUserByIdAttempted({ userId }));
  }
}
