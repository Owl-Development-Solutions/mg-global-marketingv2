import { inject, Injectable } from '@angular/core';

import { ImageUploadDatasource } from '../../datasources';
import { Observable } from 'rxjs';
import { ImageUploadRepositoryInterface } from '../../../domain';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadRepository implements ImageUploadRepositoryInterface {
  private imageUploadDatasource = inject(ImageUploadDatasource);

  imageUpload(userId: string, file: File): Observable<string> {
    return this.imageUploadDatasource.imageUpload(userId, file);
  }
}
