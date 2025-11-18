import { inject, Injectable } from '@angular/core';
import { GeonologyRepository } from '../../../repositories';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromGeonology from '../../../store/actions/geonology/geonology-actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { GeonologyNode, GeonologyResponse } from '../../../models';
import { rootUsername } from '@app-store/public-api';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class GeonologyEffects {
  private actions$ = inject(Actions);
  private geonologyRepository = inject(GeonologyRepository);
  private snackBar = inject(MatSnackBar);

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
        const {
          parentUserName,
          side,
          child,
          activationCodeId,
          sponsorUsername,
          callBacks,
        } = action;
        const data = {
          parentUserName,
          side,
          child,
          sponsorUsername,
          activationCodeId,
        };

        return this.geonologyRepository.addUserGeonology(data).pipe(
          map((response: GeonologyResponse) => {
            callBacks.onSuccess();
            return fromGeonology.addUserGeonologySucceded({
              data: response,
              parentUserName,
              side,
              child,
            });
          }),
          catchError((error) => {
            const cleanMessage = error.message.replace('Error: ', '');
            callBacks.onFailure?.({ errorMsg: cleanMessage });
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

  deleteUserGenealogyAttempted$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromGeonology.deleteUserGenealogyAttempted),
      switchMap((action) => {
        const { id } = action.userGeonology as GeonologyNode;

        return this.geonologyRepository.deleteUserGeonology(id as string).pipe(
          map((response: { message: string }) => {
            console.log(response);

            this.snackBar.open(response.message, 'x', {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 5 * 1000,
            });

            return fromGeonology.deleteUserGenealogySucceeded({
              userGeonology: action.userGeonology as GeonologyNode,
            });
          }),
          catchError((error) => {
            return of(fromGeonology.deleteUserGenealogyFailed({ error }));
          }),
        );
      }),
    );
  });
}
