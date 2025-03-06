import { Pipe, PipeTransform } from '@angular/core';

import { TargetPriceSource } from '@gq/shared/models/quotation/target-price-source.enum';
import { translateTargetPriceSourceValue } from '@gq/shared/utils/translate.utils';

@Pipe({
  name: 'targetPriceSource',
})
export class TargetPriceSourcePipe implements PipeTransform {
  transform(
    targetPriceSource: TargetPriceSource,
    dashForNoEntry = false
  ): string | null {
    if (dashForNoEntry && targetPriceSource === TargetPriceSource.NO_ENTRY) {
      return '-';
    }

    return translateTargetPriceSourceValue(targetPriceSource);
  }
}
