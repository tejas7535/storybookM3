import { Pipe, PipeTransform } from '@angular/core';

import { Keyboard } from '@gq/shared/models';
import { HelperService } from '@gq/shared/services/helper/helper.service';

@Pipe({
  name: 'multiplyWithPriceUnit',
})
export class MultiplyWithPriceUnitPipe implements PipeTransform {
  constructor(private readonly helperService: HelperService) {}

  /**
   * Transforms a value by given material or sap price unit.
   * sapPriceUnit has higher priority then materialPriceUnit and will be prefered for displaying
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
    if (!value || (!sapPriceUnit && !materialPriceUnit)) {
      return Keyboard.DASH;
    }

    const adjustedValue = sapPriceUnit
      ? value * sapPriceUnit
      : value * materialPriceUnit;

    return this.helperService.transformMarginDetails(adjustedValue, currency);
  }
}
