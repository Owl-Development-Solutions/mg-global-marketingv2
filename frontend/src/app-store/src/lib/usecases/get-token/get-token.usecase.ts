import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../data/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetTokenUsecase {
  private store = inject(Store<fromStore.UserState>);

  getAccessToken = this.store.pipe(select(fromStore.getAccessToken));

  execute(): Observable<string | undefined> {
    return this.store.select(fromStore.getAccessToken);
  }
}
