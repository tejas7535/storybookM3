import { Pipe, PipeTransform } from '@angular/core';

import { PropertyDelta } from '@gq/core/store/f-pricing/models/property-delta.interface';
import { translate } from '@ngneat/transloco';

@Pipe({
  name: 'deltaDisplay',
  standalone: true,
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
    } else {
      const translationParams = {
        absolute: delta.absolute,
        relative: delta.relative,
      };
      const translationKey =
        delta.absolute >= 0 ? `positiveDelta` : `negativeDelta`;

      return translate(
        `${this.TRANSLATE_PREFIX}.${translationKey}`,
        translationParams
      );
    }
  }
}
