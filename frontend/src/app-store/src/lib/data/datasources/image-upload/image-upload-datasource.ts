import { inject, Injectable } from '@angular/core';
import { ImageUploadInterface } from '../../models';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { AppErrors } from '../../errors';
import NotAuthorized = AppErrors.NotAuthorized;
import UnexpectedError = AppErrors.UnexpectedError;
import NotFoundError = AppErrors.NotFoundError;
import ForbiddenError = AppErrors.ForbiddenError;

@Injectable({
  providedIn: 'root',
})
export class ImageUploadDatasource implements ImageUploadInterface {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  private errorReport(error: any) {
    const message = error?.error?.error;

    switch (error.status) {
      case 401:
        return throwError(() => new NotAuthorized(message));
      case 403:
        return throwError(() => new ForbiddenError(message));
      case 404:
        return throwError(() => new NotFoundError(message));
      default:
        return throwError(() => new UnexpectedError(message));
    }
  }

  imageUpload(userId: string, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    return this.http
      .post(`${this.baseUrl}/api/upload/uploadImage`, formData, {
        withCredentials: true,
        observe: 'response',
      })
      .pipe(
        map((res) => {
          return res.headers
            .get('location')
            ?.split('/imageUrl/')
            .pop() as string;
        }),
        catchError((err) => this.errorReport(err)),
      );
  }
}
