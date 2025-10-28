import { inject, Injectable } from '@angular/core';
import * as fromStore from '../../data/store';
import { select, Store } from '@ngrx/store';
import { AddUserGeonologyData, Callbacks } from '../../data/models';
import { map, Observable, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeonologyUsecase {
  private store = inject(Store<fromStore.GeonologyState>);

  geonologyData$ = this.store.pipe(select(fromStore.geonologyData));
  genealogyTreeLoading$ = this.store.pipe(
    select(fromStore.genealogyTreeLoading),
  );

  geonoloyRootFullName$ = this.store.pipe(select(fromStore.rootFullName));

  addUserGeonology(data: AddUserGeonologyData, callBacks: Callbacks) {
    this.store.dispatch(
      fromStore.addUserGeonologyAttempted({
        parentUserName: data.parentUserName,
        side: data.side,
        child: data.child,
        activationCodeId: data.activationCodeId,
        callBacks,
      }),
    );
  }

  getGeonologyUsers(userId: string) {
    this.store.dispatch(fromStore.getGenealogyAttempted({ userId }));
  }
}
