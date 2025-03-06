import { Inject, Pipe, PipeTransform } from '@angular/core';

import { Environment } from '@cdba/environments/environment.model';
import { ENV } from '@cdba/environments/environment.provider';

/**
 * @Pipe ScrambleMaterialDesignationPipe
 *
 * @description
 *
 * scramble up material designations in order to hide the real string in browser view
 * select a certain value or a random number as part of scramble pattern
 *
 * @usageNotes
 *
 * `scrambleMaterialDesignation` pipe can be used like shown here:
 *
 * with totally random scramble pattern:
 * ```html
 * {{ someMaterialDesignation | scrambleMaterialDesignation }}
 * ```
 *
 * with a certain value as part of the scramble pattern, e.g. for testing:
 * ```html
 * {{ someMaterialDesignation | scrambleMaterialDesignation: 0 }}
 * ```
 */
@Pipe({
  name: 'scrambleMaterialDesignation',
  standalone: false,
})
export class ScrambleMaterialDesignationPipe implements PipeTransform {
  constructor(@Inject(ENV) private readonly env: Environment) {}

  transform(value: string, scramblePattern?: 0 | 1 | number): string {
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

    const valueMainPartSplit = valueSplit[1].split('.');
    if (!valueMainPartSplit[1]) {
      return value;
    }

    let valueMainPart: string;

    switch (scramblePattern) {
      case 0: {
        valueMainPart = '363453';
        break;
      }
      case 1: {
        valueMainPart = '454672';
        break;
      }
      default: {
        valueMainPart = Math.floor(
          100_000 + Math.random() * 900_000
        ).toString();
        break;
      }
    }

    valueMainPartSplit[0] = valueMainPart;
    valueSplit[1] = valueMainPartSplit.join('.');

    return valueSplit.join('-');
  }
}
