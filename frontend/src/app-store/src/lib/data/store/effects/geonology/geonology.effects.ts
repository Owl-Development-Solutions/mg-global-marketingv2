import { inject, Injectable } from '@angular/core';
import { GeonologyRepository } from '../../../repositories';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromGeonology from '../../../store/actions/geonology/geonology-actions';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class GeonologyEffects {
  private actions$ = inject(Actions);
  private geonologyRepository = inject(GeonologyRepository);

  addUserGeonologyAttempted$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromGeonology.addUserGeonologyAttempted),
      switchMap((action) => {
        const { parentUserName, side, child } = action;
        const data = {
          parentUserName,
          side,
          child: child,
        };

        console.log('action called');

        return this.geonologyRepository.addUserGeonology(data).pipe(
          map((data: any) =>
            fromGeonology.addUserGeonologySucceded({
              parentUserName,
              side,
              child,
            }),
          ),
          catchError((error) => {
            return of(fromGeonology.addUserGeonologyFailed({ error }));
          }),
        );
      }),
    );
  });
}
