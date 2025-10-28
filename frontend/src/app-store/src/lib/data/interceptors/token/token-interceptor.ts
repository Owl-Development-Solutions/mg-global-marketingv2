import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GetTokenUsecase, RefreshTokenUsecase } from '../../../usecases';
import { catchError, Observable, switchMap, throwError, of } from 'rxjs';
import { Router } from '@angular/router';
import { AppErrors } from '../../errors';
import NotAuthorized = AppErrors.NotAuthorized;

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private getTokenUsecase = inject(GetTokenUsecase);
  private refreshTokenUsecase = inject(RefreshTokenUsecase);
  private router = inject(Router);

  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (httpRequest.withCredentials) {
      return this.getTokenUsecase.execute().pipe(
        switchMap((token: string | undefined) => {
          if (token) {
            return this.addToken(httpRequest, next, token).pipe(
              catchError((error) => {
                const statusText =
                  error.error && error.error.message
                    ? error.error.message
                    : error.statusText;

                if (
                  error instanceof HttpErrorResponse &&
                  error.status === 403 &&
                  statusText === 'Invalid or expired token'
                ) {
                  return this.refreshTokenUsecase.execute().pipe(
                    switchMap((newToken: string | undefined) => {
                      return this.addToken(httpRequest, next, token);
                    }),
                    catchError((err) => {
                      return this.handleError(err);
                    }),
                  );
                }
                return throwError(() => error || new Error('Unknown Error'));
              }),
            );
          }
          return this.handleError();
        }),
        catchError((err) => {
          if (err instanceof HttpErrorResponse && err.status === 401) {
            return this.handleError(err);
          } else if (err instanceof NotAuthorized) {
            return this.handleError();
          }
          return throwError(() => err);
        }),
      );
    }
    return next.handle(httpRequest);
  }

  private addToken = (
    httpRequest: HttpRequest<any>,
    next: HttpHandler,
    token: string,
  ) => {
    return next.handle(
      httpRequest.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      }),
    );
  };

  private handleError(error?: HttpErrorResponse): Observable<never> {
    const redirectTo = window.location.pathname;
    this.redirectToPath('/auth/credentials', redirectTo);
    return throwError(() => error || new Error('Need to login'));
  }

  private redirectToPath(path: string, onLogin?: string): void {
    this.router.navigate([path], { queryParams: { onLogin } });
  }

  //   private handleResponseError(
  //     error: HttpErrorResponse,
  //     req: HttpRequest<any>,
  //     next: HttpHandler,
  //   ): Observable<HttpEvent<any>> {
  //     const isExpired =
  //       error.error?.message?.toLowerCase().includes('expired') ||
  //       error.error?.message?.toLowerCase().includes('invalid');

  //     if ((error.status === 401 || error.status === 403) && isExpired) {
  //       return this.refreshTokenUsecase.execute().pipe(
  //         switchMap((newToken) => {
  //           if (!newToken) return this.handleError(error);

  //           const authData = JSON.parse(localStorage.getItem('authData') ?? '{}');
  //           localStorage.setItem(
  //             'authData',
  //             JSON.stringify({ ...authData, accessToken: newToken }),
  //           );

  //           const cloned = req.clone({
  //             setHeaders: { Authorization: `Bearer ${newToken}` },
  //           });

  //           return next.handle(cloned);
  //         }),
  //         catchError((err) => this.handleError(err)),
  //       );
  //     }

  //     if (error.status === 401) {
  //       return this.handleError(error);
  //     }

  //     return throwError(() => error);
  //   }

  //   private handleError(error?: HttpErrorResponse): Observable<never> {
  //     localStorage.removeItem('authData');

  //     this.router.navigate(['/auth/credentials'], {
  //       queryParams: { redirect: window.location.pathname },
  //     });

  //     return throwError(() => error || new Error('Authentication required'));
  //   }
}
