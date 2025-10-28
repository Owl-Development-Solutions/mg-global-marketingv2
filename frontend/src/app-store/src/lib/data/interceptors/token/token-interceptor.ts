// import {
//   HttpErrorResponse,
//   HttpEvent,
//   HttpHandler,
//   HttpInterceptor,
//   HttpRequest,
// } from '@angular/common/http';
// import { inject, Injectable } from '@angular/core';
// import { GetTokenUsecase, RefreshTokenUsecase } from '../../../usecases';
// import { catchError, Observable, switchMap, throwError, of } from 'rxjs';
// import { Router } from '@angular/router';

// @Injectable()
// export class TokenInterceptor implements HttpInterceptor {
//   private getTokenUsecase = inject(GetTokenUsecase);
//   private refreshTokenUsecase = inject(RefreshTokenUsecase);
//   private router = inject(Router);

//   intercept(
//     req: HttpRequest<any>,
//     next: HttpHandler,
//   ): Observable<HttpEvent<any>> {
//     return this.getTokenUsecase.execute().pipe(
//       switchMap((token) => {
//         console.log(token);

//         const cloned = token
//           ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
//           : req;

//         return next
//           .handle(cloned)
//           .pipe(
//             catchError((error) => this.handleResponseError(error, req, next)),
//           );
//       }),
//       catchError((error) => this.handleError(error)),
//     );
//   }

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
// }
