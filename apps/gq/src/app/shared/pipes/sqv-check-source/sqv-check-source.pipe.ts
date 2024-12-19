import { Pipe, PipeTransform } from '@angular/core';

import { Keyboard } from '@gq/shared/models';
import { SqvCheckSource } from '@gq/shared/models/quotation-detail/cost';
import { translate } from '@jsverse/transloco';

@Pipe({
  name: 'sqvCheckSource',
  standalone: true,
})
export class SqvCheckSourcePipe implements PipeTransform {
  transform(source: SqvCheckSource): string {
    if (!source) {
      return Keyboard.DASH;
    }

    return translate(`shared.sqvCheckSource.${source}`);
  }
}
