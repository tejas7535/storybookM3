import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lsaCustomCurrency',
})
export class LsaCurrencyPipe implements PipeTransform {
  transform(value: string): string | undefined {
    if (value) {
      const currencyValueWithSpace = value.replace(/^(\D+)(\d)/, '$1 $2');

      return currencyValueWithSpace;
    }

    return value;
  }
}
