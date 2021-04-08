import { Pipe, PipeTransform } from '@angular/core';

import { HelperService } from '../../services/helper-service/helper-service.service';

@Pipe({
  name: 'numberCurrency',
})
export class NumberCurrencyPipe implements PipeTransform {
  transform(value: number, currency: string): string {
    return HelperService.transformMarginDetails(value, currency);
  }
}
