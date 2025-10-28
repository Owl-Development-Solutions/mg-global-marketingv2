import { inject, Injectable } from '@angular/core';
import { GeonologyRepository } from '../../../repositories';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromGeonology from '../../../store/actions/geonology/geonology-actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { GeonologyNode } from '../../../models';

@Injectable()
export class GeonologyEffects {
  private actions$ = inject(Actions);
  private geonologyRepository = inject(GeonologyRepository);

  getGenealogyAttempted$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromGeonology.getGenealogyAttempted),
      switchMap((action) => {
        const { userId } = action;

        return this.geonologyRepository.getGeanology(userId).pipe(
          map((data: GeonologyNode) =>
            fromGeonology.getGenealogySucceeded({ data }),
          ),
          catchError((error) => {
            return of(fromGeonology.addUserGeonologyFailed({ error }));
          }),
        );
      }),
    );
  });

  addUserGeonologyAttempted$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromGeonology.addUserGeonologyAttempted),
      switchMap((action) => {
        const { parentUserName, side, child, activationCodeId, callBacks } =
          action;
        const data = { parentUserName, side, child, activationCodeId };

        return this.geonologyRepository.addUserGeonology(data).pipe(
          map(() => {
            callBacks.onSuccess();
            return fromGeonology.addUserGeonologySucceded({
              parentUserName,
              side,
              child,
            });
          }),
          catchError((error) => {
            callBacks.onFailure?.({ errorMsg: error });
            return of(
              fromGeonology.addUserGeonologyFailed({
                error,
              }),
            );
          }),
        );
      }),
    );
  });
}
