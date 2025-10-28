import { inject, Injectable } from '@angular/core';
import {
  AddUserGeonologyData,
  Document,
  GeonologyInterface,
  GeonologyNode,
  GeonologyResponse,
} from '../../models';
import { catchError, delay, map, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.production';
import { AppErrors } from '../../errors';
import NotAuthorized = AppErrors.NotAuthorized;
import UnexpectedError = AppErrors.UnexpectedError;
import NotFoundError = AppErrors.NotFoundError;
import ForbiddenError = AppErrors.ForbiddenError;

@Injectable({
  providedIn: 'root',
})
export class GeonologyDatasource implements GeonologyInterface {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  stored = localStorage.getItem('authz');
  parsed = this.stored ? JSON.parse(this.stored) : null;
  accessToken = this.parsed?.data?.accessToken;

  private errorReport(error: any) {
    console.log(`error`, error.error.error);
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

  getGeanology(userId: string): Observable<GeonologyNode> {
    return this.http
      .get<Document<GeonologyNode>>(
        `${this.baseUrl}/api/geonology/getGeonology?user=${userId}`,
        {
          withCredentials: true,
        },
      )
      .pipe(
        map((resp: Document<GeonologyNode>) => resp.data as GeonologyNode),
        catchError((error) => this.errorReport(error)),
      );
  }

  addUserGeonology(data: AddUserGeonologyData): Observable<GeonologyResponse> {
    return this.http
      .post<Document<GeonologyResponse>>(
        `${this.baseUrl}/api/geonology/addGeonology`,
        data,
        {
          withCredentials: true,
        },
      )
      .pipe(
        map(
          (resp: Document<GeonologyResponse>) => resp.data as GeonologyResponse,
        ),
        catchError((error) => this.errorReport(error)),
      );
  }
}
