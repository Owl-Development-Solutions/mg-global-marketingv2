import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '../../data/store';
import { ImageUploadRepository } from '../../data/repositories';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadThingUsecase {
  private store = inject(Store<any>);

  execute(userId: string, file: File) {
    return this.store.dispatch(
      fromStore.uploadUserImageAttempted({
        userId,
        file,
      }),
    );
  }
}
