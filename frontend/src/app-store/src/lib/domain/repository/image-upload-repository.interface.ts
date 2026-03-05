import { Observable } from 'rxjs';

export interface ImageUploadRepositoryInterface {
  imageUpload(userId: string, file: File): Observable<string>;
}
