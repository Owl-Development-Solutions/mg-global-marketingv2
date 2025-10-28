import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AppErrors } from '../../errors';
import UnexpectedError = AppErrors.UnexpectedError;
import InvalidCredentials = AppErrors.InvalidCredentials;
import UserNotFound = AppErrors.UserNotFound;
import { UserDatasourceInterface } from '../../models/user.interface';
import { UserResponseModel } from '../../models/user.attributes.model';
import { Document } from '../../models/json-api.interface';

@Injectable({
  providedIn: 'root',
})
export class UserDatasource implements UserDatasourceInterface {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  private userErrorReport(error: any) {
    switch (error.status) {
      case 424:
        return throwError(() => new InvalidCredentials());
      case 404:
        return throwError(() => new UserNotFound());
      default:
        return throwError(() => new UnexpectedError());
    }
  }

  getUser(token?: string): Observable<UserResponseModel> {
    const stored = localStorage.getItem('authData');
    const parsed = stored ? JSON.parse(stored) : null;
    const accessToken = parsed?.accessToken || token;

    console.log('Access token:', accessToken);

    return this.http
      .post<Document<UserResponseModel>>(
        `${this.baseUrl}/api/getUser/getUserByAccessToken`,
        { token },
        {
          withCredentials: true,
        },
      )
      .pipe(
        map(
          (data: Document<UserResponseModel>) => data.data as UserResponseModel,
        ),
        catchError((error) => this.userErrorReport(error)),
      );
  }

  getUserById(userId?: string): Observable<UserResponseModel> {
    return this.http
      .post<Document<UserResponseModel>>(
        `${this.baseUrl}/api/getUser/getUserById`,
        {
          userId,
        },
        { withCredentials: true },
      )
      .pipe(
        map(
          (data: Document<UserResponseModel>) => data.data as UserResponseModel,
        ),
        catchError((err) => this.userErrorReport(err)),
      );
  }
}
