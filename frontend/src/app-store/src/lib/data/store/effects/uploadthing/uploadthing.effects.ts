import { inject, Injectable } from '@angular/core';
import { ImageUploadRepository } from '../../../repositories';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as fromImageUpload from '../../actions/image-upload/upload-image.actions';
import { catchError, map, switchMap } from 'rxjs';

@Injectable()
export class UploadThingEffects {
  private actions$ = inject(Actions);
  private imageUploadRepo = inject(ImageUploadRepository);
  private snackBar = inject(MatSnackBar);

  uploadImageAttempted$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromImageUpload.uploadUserImageAttempted),
      switchMap((action) => {
        const { userId, file } = action;

        return this.imageUploadRepo.imageUpload(userId, file).pipe(
          map((resp: string) => {
            this.snackBar.open('Image uploaded successfully', 'x', {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 5 * 1000,
            });

            return fromImageUpload.uploadUserImageSucceeded({ resp });
          }),
          catchError((error) => {
            return [fromImageUpload.uploadUserImageFailed({ error })];
          }),
        );
      }),
    );
  });
}
