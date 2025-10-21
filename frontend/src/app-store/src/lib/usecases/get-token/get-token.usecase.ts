import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '../../data/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetTokenUsecase {
  private store = inject(Store<fromStore.UserState>);

  execute(): Observable<string | undefined> {
    return this.store.select(fromStore.getAccessToken);
  }
}
