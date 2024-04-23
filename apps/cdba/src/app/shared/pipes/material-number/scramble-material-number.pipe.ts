import { Inject, Pipe, PipeTransform } from '@angular/core';

import { Environment } from '@cdba/environments/environment.model';
import { ENV } from '@cdba/environments/environment.provider';

/**
 * @Pipe ScrambleMaterialNumberPipe
 *
 * @description
 *
 * scramble up material numbers in order to hide the real value in browser view
 * select a certain value or a random number as part of scramble pattern
 *
 * @usageNotes
 *
 * `scrambleMaterialDesignation` pipe can be used like shown here:
 *
 * with totally random scramble pattern:
 * ```html
 * {{ someMaterialNumber | scrambleMaterialNumber }}
 * ```
 *
 * with a certain value as part of the scramble pattern, e.g. for testing:
 * ```html
 * {{ someMaterialNumber | scrambleMaterialNumber: 0 }}
 * ```
 */
@Pipe({
  name: 'scrambleMaterialNumber',
})
export class ScrambleMaterialNumberPipe implements PipeTransform {
  constructor(@Inject(ENV) private readonly env: Environment) {}

  transform(value: string, scramblePattern?: 0 | 1): string {
    if (!value) {
      return undefined;
    }

    if (this.env.production || !this.env.scrambleMaterialIds) {
      return value;
    }

    const valueSplit = value.split('-');
    if (!valueSplit[1]) {
      return value;
    }

    let valueMainPart: string;

    switch (scramblePattern) {
      case 0: {
        valueMainPart = '736234653';
        break;
      }
      case 1: {
        valueMainPart = '945346672';
        break;
      }
      default: {
        valueMainPart = Math.floor(
          100_000_000 + Math.random() * 900_000_000
        ).toString();
        break;
      }
    }

    valueSplit[0] = valueMainPart;

    return valueSplit.join('-');
  }
}
