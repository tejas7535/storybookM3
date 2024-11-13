import { Pipe, PipeTransform } from '@angular/core';

import { QuotationDetail } from '@gq/shared/models';
import { translateTargetPriceSourceValue } from '@gq/shared/utils/translate.utils';

@Pipe({
  name: 'targetPriceSource',
  standalone: true,
})
export class TargetPriceSourcePipe implements PipeTransform {
  transform(detail: QuotationDetail): string | null {
    return translateTargetPriceSourceValue(detail.targetPriceSource);
  }
}
