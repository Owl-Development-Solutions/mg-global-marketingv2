import { inject, Inject, Injectable } from '@angular/core';
import { AuthProfileInterface, AuthUserResponse, Document } from '../../models';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { AuthErrors } from '../../errors';
import NotAuthorized = AuthErrors.NotAuthorized;
import UnexpectedError = AuthErrors.UnexpectedError;
import InvalidCredentials = AuthErrors.InvalidCredentials;
import EmailRequired = AuthErrors.EmailRequired;
import UserNotFound = AuthErrors.UserNotFound;

@Injectable({
  providedIn: 'root',
})
export class AuthDatasource implements AuthProfileInterface {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  private authErrorReport(error: any) {
    switch (error.status) {
      case 424:
        return throwError(() => new InvalidCredentials());
      case 404:
        return throwError(() => new UserNotFound());
      default:
        return throwError(() => new UnexpectedError());
    }
  }

  initiateAuth(data: {
    email: string;
    password: string;
  }): Observable<AuthUserResponse> {
    return this.http
      .post<
        Document<AuthUserResponse>
      >(`${this.baseUrl}/api/loginUser/v1`, data)
      .pipe(
        map((data: Document<AuthUserResponse>) => data as AuthUserResponse),
        catchError((error) => this.authErrorReport(error)),
      );
  }
}
