import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthUsecase } from '@app-store/lib/usecases';
import { map, Observable, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  private authUsecase = inject(AuthUsecase);

  private router = inject(Router);

  canActivate(): Observable<boolean> {
    return this.authUsecase.getAuthenticated$.pipe(
      take(1),
      map((isAuthenticated: boolean | undefined) => isAuthenticated ?? false),
      tap((isAuthenticated: boolean) => {
        if (!isAuthenticated) {
          this.router.navigate(['/auth/credentials']);
        }
      }),
      map((isAuthenticated: boolean) => isAuthenticated),
    );
  }
}

export const AuthGuardFn: CanActivateFn = () => {
  return inject(AuthGuard).canActivate();
};
