import { inject, Injectable } from '@angular/core';
import { Callbacks, UserEditData } from '@app-store/public-api';
import { Store } from '@ngrx/store';
import * as fromStore from '../../data/store';

@Injectable({
  providedIn: 'root',
})
export class EditUserUsecase {
  private store = inject(Store<fromStore.AuthState>);

  execute(data: UserEditData, callBacks: Callbacks) {
    this.store.dispatch(
      fromStore.updateUserProfileAttempted({
        data,
        callBacks,
      }),
    );
  }
}
