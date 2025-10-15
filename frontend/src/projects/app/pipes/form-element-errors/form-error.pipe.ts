import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'formError',
})
export class FormErrorPipe implements PipeTransform {
  camelToSpaces = (text: string) => {
    const result = text.replace(/([A-Z])/g, ' $1');
    return result.charAt(0) + result.slice(1).toLowerCase();
  };

  transform(errors: ValidationErrors, label: string): string | null {
    console.log(errors);

    if (errors) {
      if (errors['required']) {
        return `${label} is required`;
      } else if (errors['minLengthError']) {
        return errors['minLengthError'];
      } else if (errors['isInvalidPassword']) {
        return errors['isInvalidPassword'];
      } else {
        return Object.keys(errors).reduce((acc, errKey) => {
          return `${acc}${label} ${this.camelToSpaces(errKey)}. `;
        }, ``);
      }
    }
    return null;
  }
}
