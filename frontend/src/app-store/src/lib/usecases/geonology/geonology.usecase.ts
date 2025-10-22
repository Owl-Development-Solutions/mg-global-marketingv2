import { inject, Injectable } from '@angular/core';
import * as fromStore from '../../data/store';
import { select, Store } from '@ngrx/store';
import { AddUserGeonologyData } from '../../data/models';

@Injectable({
  providedIn: 'root',
})
export class GeonologyUsecase {
  private store = inject(Store<fromStore.GeonologyState>);

  geonologyData$ = this.store.pipe(select(fromStore.geonologyData));

  addUserGeonology(data: AddUserGeonologyData) {
    console.log('usecase', {
      parentUserName: data.parentUserName,
      side: data.side,
      child: data.child,
    });

    this.store.dispatch(
      fromStore.addUserGeonologyAttempted({
        parentUserName: data.parentUserName,
        side: data.side,
        child: data.child,
      }),
    );
  }
}

//  child: {
//       userName: 'newMember01',
//       firstName: 'John',
//       lastName: 'Doe',
//       balance: 0,
//       leftPoints: 0,
//       rightPoints: 0,
//       leftDownline: 0,
//       rightDownline: 0,
//       rankPoints: 1,
//       level: { low: 1, high: 0 },
//       side: '[L]',
//       hasDeduction: false,
//     },
// {
//     parentUserName: 'richchristine01',
//     side: 'left',
//     child: {
//       userName: 'newMember01',
//       firstName: 'John',
//       lastName: 'Doe',
//       balance: 0,
//       leftPoints: 0,
//       rightPoints: 0,
//       leftDownline: 0,
//       rightDownline: 0,
//       rankPoints: 1,
//       level: { low: 1, high: 0 },
//       side: '[L]',
//       hasDeduction: false,
// }
