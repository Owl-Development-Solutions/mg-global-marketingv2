import { inject, Injectable } from '@angular/core';
import * as fromStore from '../../data/store';
import { select, Store } from '@ngrx/store';
import {
  AddUserGeonologyData,
  Callbacks,
  GeonologyNode,
} from '../../data/models';
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

  rootUsername$ = this.store.pipe(select(fromStore.rootUsername));

  addUserGeonology(data: AddUserGeonologyData, callBacks: Callbacks) {
    this.store.dispatch(
      fromStore.addUserGeonologyAttempted({
        parentUserName: data.parentUserName,
        side: data.side,
        child: data.child,
        activationCodeId: data.activationCodeId,
        sponsorUsername: data.sponsorUsername,
        callBacks,
      }),
    );
  }

  getGeonologyUsers(userId: string) {
    this.store.dispatch(fromStore.getGenealogyAttempted({ userId }));
  }

  deleteUserGeonology(userGeonology: GeonologyNode | null) {
    this.store.dispatch(
      fromStore.deleteUserGenealogyAttempted({ userGeonology }),
    );
  }
}
