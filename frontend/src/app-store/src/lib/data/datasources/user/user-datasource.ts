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
import { UserData } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class UserDatasource implements UserDatasourceInterface {
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

  getUser(token?: string): Observable<UserResponseModel> {
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

  searchUserName(userName: string): Observable<string> {
    return this.http
      .post<Document<string>>(
        `${this.baseUrl}/api/getUser/isUsernameUsed`,
        {
          userName,
        },
        {
          withCredentials: true,
        },
      )
      .pipe(
        map((data: Document<string>) => data.data as any),
        catchError((err) => this.userErrorReport(err)),
      );
  }

  userNameExist(username: string): Observable<UserData[]> {
    return this.http
      .post<Document<UserData[]>>(
        `${this.baseUrl}/api/getUser/searchUsername`,
        {
          username,
        },
        { withCredentials: true },
      )
      .pipe(
        map((data: Document<UserData[]>) => data.data as UserData[]),
        catchError((err) => this.userErrorReport(err)),
      );
  }
}
