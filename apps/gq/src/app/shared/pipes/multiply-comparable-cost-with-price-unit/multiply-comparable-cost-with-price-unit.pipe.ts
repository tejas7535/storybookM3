import { Pipe, PipeTransform } from '@angular/core';

import { Keyboard } from '@gq/shared/models';
import { HelperService } from '@gq/shared/services/helper/helper.service';

@Pipe({
  name: 'multiplyComparableCostWithPriceUnit',
})
export class MultiplyComparableCostWithPriceUnitPipe implements PipeTransform {
  constructor(private readonly helperService: HelperService) {}

  /**
   * Transforms a comparable cost by given sapPrice Unit.
   * A comparable cost is always saved on the factor of {@param materialPriceUnit}.
   *
   * @param cost the cost
   * @param currency the currency of the cost
   * @param materialPriceUnit the price Unit of the material
   * @param sapPriceUnit the price unit saved in SAP
   * @returns the transformed value as {@link string}
   */
  transform(
    value: number,
    currency: string,
    materialPriceUnit: number,
    sapPriceUnit: number
  ): string {
    if (!value || !materialPriceUnit) {
      return Keyboard.DASH;
    }

    const adjustedValue = sapPriceUnit
      ? (value / materialPriceUnit) * sapPriceUnit
      : // value does not have to be multiplied with materialPriceUnit because it is already saved on that factor in the db
        value;

    return this.helperService.transformMarginDetails(adjustedValue, currency);
  }
}
