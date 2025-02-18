import { Pipe, PipeTransform } from '@angular/core';

import { translate } from '@jsverse/transloco';

@Pipe({
  name: 'errorMessage',
  standalone: true,
})
export class ErrorMessagePipe implements PipeTransform {
  public transform(errors: { [key: string]: any }): string {
    if (errors.required) {
      return this.translateError('required');
    }
    if (errors.dependency) {
      return this.translateError('dependency');
    }
    if (errors.min) {
      return this.translateError('min', { min: errors.min.min });
    }
    if (errors.scopeTotalLowerThanSingleScopes) {
      return this.translateError('co2TooLowShort', {
        min: errors.scopeTotalLowerThanSingleScopes.min,
      });
    }
    if (errors.scopeTotalHigherThanSingleScopes) {
      return this.translateError('co2TooHighShort', {
        max: errors.scopeTotalHigherThanSingleScopes.max,
      });
    }
    if (errors.invalidBusinessPartnerId) {
      return this.translateError('invalidBusinessPartnerId');
    }

    return this.translateError('generic');
  }

  private translateError(key: string, params = {}): string {
    return translate(
      `materialsSupplierDatabase.mainTable.dialog.error.${key}`,
      params
    );
  }
}
