import { Pipe, PipeTransform } from '@angular/core';

import { HelperService } from '../../services/helper/helper.service';

@Pipe({
  name: 'numberCurrency',
})
export class NumberCurrencyPipe implements PipeTransform {
  constructor(private readonly helperService: HelperService) {}

  transform(value: number, currency: string): string {
    return this.helperService.transformMarginDetails(value, currency);
  }
}
