import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { GeonologyUsecase } from '@app-store/lib/usecases';
import { of } from 'rxjs';

export const GetGenealogyGuardFn: CanActivateFn = (
  route: ActivatedRouteSnapshot,
) => {
  const geonologyUsecase = inject(GeonologyUsecase);
  const router = inject(Router);

  const userId = route.paramMap.get('user') || route.queryParamMap.get('user');

  if (userId) {
    geonologyUsecase.getGeonologyUsers(userId);
    return true;
  }

  return of(false);
};
