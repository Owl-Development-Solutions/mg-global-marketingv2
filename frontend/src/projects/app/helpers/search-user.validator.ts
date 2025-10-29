import {
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn,
} from '@angular/forms';
import { UserUsecase } from '@app-store/lib/usecases';

import { Observable, of, map, catchError, switchMap, timer, take } from 'rxjs';

/**
 * Creates an AsyncValidatorFn to check if the username is available via an API call.
 * @param userService The UserUsecase dependency.
 * @param minLength The minimum length to check before triggering the API call.
 */
export function usernameAvailableValidator(
  userService: UserUsecase,
  minLength: number = 3,
): AsyncValidatorFn {
  return (
    control: AbstractControl,
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    const value = control.value;

    if (!value || value.length < minLength) {
      return of(null);
    }

    return timer(300).pipe(
      switchMap(() => {
        return userService.executeGetUsername(value.toLowerCase()).pipe(
          take(1),
          map(() => null),
          catchError((error) => {
            return of({
              usernameTaken: {
                message:
                  error.error || error.message || 'Username is already taken.',
              },
            });
          }),
        );
      }),
    );
  };
}
