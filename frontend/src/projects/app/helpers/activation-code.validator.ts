import {
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn,
} from '@angular/forms';
import { ActivationCodeUsecase } from '@app-store/lib/usecases';

import { Observable, of, map, catchError, switchMap, timer, take } from 'rxjs';

/**
 * Creates an AsyncValidatorFn to check if the activation code is valid/available via an API call.
 * @param codeService The ActivationCodeUsecase dependency.
 * @param minLength The minimum length to check before triggering the API call.
 */
export function activationCodeValidValidator(
  codeService: ActivationCodeUsecase,
  minLength: number = 8,
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
        return codeService.searchActivationCode(value.toLowerCase()).pipe(
          take(1),
          map(() => null),

          catchError((error) => {
            console.error('Activation Code API error:', error);
            return of({
              invalidActivationCode: {
                message: error.error || error.message || 'Unknown error.',
              },
            });
          }),
        );
      }),
    );
  };
}
