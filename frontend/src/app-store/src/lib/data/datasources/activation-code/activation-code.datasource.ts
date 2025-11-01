import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.production';
import { AppErrors } from '../../errors';
import UnexpectedError = AppErrors.UnexpectedError;
import InvalidCredentials = AppErrors.InvalidCredentials;
import UserNotFound = AppErrors.UserNotFound;
import { HttpClient } from '@angular/common/http';
import { Document } from '../../models/json-api.interface';

@Injectable({
  providedIn: 'root',
})
export class ActivationCodeDatasource {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  private userErrorReport(error: any) {
    const message = error?.error?.error;
    switch (error.status) {
      case 424:
        return throwError(() => new InvalidCredentials(message));
      case 404:
        return throwError(() => new UserNotFound(message));
      default:
        return throwError(() => new UnexpectedError(message));
    }
  }

  searchActivationCode(activationCode: string): Observable<string> {
    return this.http
      .post<Document<string>>(
        `${this.baseUrl}/api/activationCode/searchActivationCode`,
        {
          activationCode,
        },
        {
          withCredentials: true,
        },
      )
      .pipe(
        map((data: Document<string>) => data.data as any),
        catchError((error) => this.userErrorReport(error)),
      );
  }
}
