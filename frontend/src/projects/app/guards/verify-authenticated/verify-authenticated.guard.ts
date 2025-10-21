import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthUsecase, GetTokenUsecase } from '@app-store/lib/usecases';
import * as fromUserStore from '@app-store/lib/data/store';
import { Store } from '@ngrx/store';
import { catchError, map, Observable, of, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class verifyAuthenticatedGuard {
  private authUsecase = inject(AuthUsecase);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    return this.authUsecase.getAuthenticated$.pipe(
      take(1),
      map((isAuthenticated: boolean | undefined) => isAuthenticated ?? false),
      tap((isAuthenticated: boolean) => {
        if (isAuthenticated) {
          this.router.navigate(['/dashboard']);
        }
      }),
      map((isAuthenticated: boolean) => !isAuthenticated),
    );
  }
}

export const verifyAuthenticatedGuardFn: CanActivateFn = () => {
  return inject(verifyAuthenticatedGuard).canActivate();
};
