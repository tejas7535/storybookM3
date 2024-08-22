import { Pipe, PipeTransform } from '@angular/core';

import {
  PriceSource,
  QuotationDetail,
  SapPriceCondition,
} from '@gq/shared/models';
import { getSapStandardPriceSource } from '@gq/shared/utils/price-source.utils';
import { translate } from '@jsverse/transloco';

@Pipe({
  name: 'priceSource',
  standalone: true,
})
export class PriceSourcePipe implements PipeTransform {
  transform(detail: QuotationDetail): PriceSource | null {
    // When price condition is Standard check for special SAP conditions
    // to return proper price source
    const priceSource =
      detail.sapPriceCondition === SapPriceCondition.STANDARD
        ? getSapStandardPriceSource(detail)
        : detail.priceSource;

    return translate('shared.quotationDetailsTable.priceSourceLabel', {
      priceSource,
    });
  }
}
