import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { UserUsecase } from '@app-store/lib/usecases';

export const GetUserByIdGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state,
) => {
  const getUserUsecase = inject(UserUsecase);
  const id = route.paramMap.get('user') || route.queryParamMap.get('user');

  if (id) {
    getUserUsecase.execute(id);

    return true;
  }

  return false;
};
