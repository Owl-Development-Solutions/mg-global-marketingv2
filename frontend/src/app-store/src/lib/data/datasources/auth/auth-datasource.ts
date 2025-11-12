import { inject, Inject, Injectable } from '@angular/core';
import {
  AuthProfileInterface,
  AuthUserResponse,
  Document,
  RegisterData,
  UserResponseModel,
} from '../../models';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { AppErrors } from '../../errors';
import UnexpectedError = AppErrors.UnexpectedError;
import InvalidCredentials = AppErrors.InvalidCredentials;
import UserNotFound = AppErrors.UserNotFound;

@Injectable({
  providedIn: 'root',
})
export class AuthDatasource implements AuthProfileInterface {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  private authErrorReport(error: any) {
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

  private executeAuthRequest<T, R>(endpoint: string, data: T): Observable<R> {
    const url = `${this.baseUrl}/${endpoint}`;

    return this.http.post<Document<R>>(url, data).pipe(
      map((response: Document<R>) => {
        return response.data as R;
      }),
      catchError((error) => this.authErrorReport(error)),
    );
  }

  initiateAuth(data: {
    email: string;
    password: string;
  }): Observable<UserResponseModel> {
    return this.executeAuthRequest<
      { email: string; password: string },
      UserResponseModel
    >('api/auth/login', data);
  }

  refreshToken(refreshToken: string): Observable<AuthUserResponse> {
    return this.executeAuthRequest<{ refreshToken: string }, AuthUserResponse>(
      'api/auth/refresh-token',
      {
        refreshToken,
      },
    );
  }

  registerUser(data: RegisterData): Observable<string> {
    return this.executeAuthRequest<{ data: RegisterData }, string>(
      'api/auth/register',
      {
        data,
      },
    );
  }
}
