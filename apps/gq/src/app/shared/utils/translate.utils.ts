import { translate } from '@jsverse/transloco';

import { TargetPriceSource } from '../models/quotation/target-price-source.enum';

export const translateTargetPriceSourceValue = (
  targetPriceSource: TargetPriceSource
): string =>
  translate('shared.quotationDetailsTable.targetPriceSource.values', {
    targetPriceSource,
  });
