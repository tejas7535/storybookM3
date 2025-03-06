import { Pipe, PipeTransform } from '@angular/core';

import { TransformationService } from '@gq/shared/services/transformation/transformation.service';

@Pipe({
  name: 'numberCurrency',
  standalone: false,
})
export class NumberCurrencyPipe implements PipeTransform {
  constructor(private readonly transformationService: TransformationService) {}

  transform(
    value: number,
    currency: string,
    keepValue: boolean = false
  ): string {
    return this.transformationService.transformNumberCurrency(
      value,
      currency,
      keepValue
    );
  }
}
