import { Observable } from 'rxjs';

export interface ImageUploadInterface {
  imageUpload(userId: string, file: File): Observable<string>;
}
