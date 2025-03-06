import { Pipe, PipeTransform } from '@angular/core';

import { PropertyDelta } from '@gq/core/store/f-pricing/models/property-delta.interface';
import { translate } from '@jsverse/transloco';

@Pipe({
  name: 'deltaDisplay',
})
export class DeltaDisplayPipe implements PipeTransform {
  private readonly TRANSLATE_PREFIX =
    'fPricing.pricingAssistantModal.comparisonPanel';

  transform(delta: PropertyDelta): string {
    if (!delta) {
      return '';
    }

    if (delta.absolute === undefined || delta.relative === undefined) {
      return translate(`${this.TRANSLATE_PREFIX}.differentString`);
    }

    return delta.absolute >= 0
      ? `+${delta.absolute} (+${delta.relative})`
      : `${delta.absolute} (${delta.relative})`;
  }
}
