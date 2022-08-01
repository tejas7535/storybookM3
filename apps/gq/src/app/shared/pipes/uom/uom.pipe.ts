import { Pipe, PipeTransform } from '@angular/core';

import { translate } from '@ngneat/transloco';

@Pipe({
  name: 'uom',
})
export class UomPipe implements PipeTransform {
  transform(value: string): string {
    return value === 'ST'
      ? translate('shared.quotationDetailsTable.ST')
      : value;
  }
}
