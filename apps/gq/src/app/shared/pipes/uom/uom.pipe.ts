import { Pipe, PipeTransform } from '@angular/core';

import { translate } from '@jsverse/transloco';

@Pipe({
  name: 'uom',
})
export class UomPipe implements PipeTransform {
  transform(value: string): string {
    return value === 'ST' || value === 'PC'
      ? translate('shared.quotationDetailsTable.ST')
      : value;
  }
}
