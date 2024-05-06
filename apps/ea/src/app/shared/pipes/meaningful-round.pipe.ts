import { Injectable, Pipe, PipeTransform } from '@angular/core';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';

import { roundToThreeSigFigs } from '../helper/number-helper';

const extractPrefix = (input: string): string | undefined => {
  const regex = /^(\S+\s)/;

  const match = input.match(regex);

  return match ? match[1] : undefined;
};

@Pipe({ name: 'meaningfulRound', standalone: true })
@Injectable({ providedIn: 'root' })
export class MeaningfulRoundPipe implements PipeTransform {
  constructor(
    private readonly translocoLocaleService: TranslocoLocaleService
  ) {}

  transform(value: number | string | null | undefined): string | null {
    if (value === undefined || value === null) {
      // eslint-disable-next-line unicorn/no-null
      return null;
    }

    // extract prefix (special case for strings like "> 10000000")
    const prefix = (typeof value === 'string' && extractPrefix(value)) || '';

    const roundedNumber = roundToThreeSigFigs(
      typeof value === 'number'
        ? value
        : Number.parseFloat(value.replace(prefix, ''))
    );

    // if this didn't work (e.g. value was no number after all) return original
    if (roundedNumber === 'NaN') {
      return value as string;
    }

    const transformed = this.translocoLocaleService.localizeNumber(
      roundedNumber,
      'decimal'
    );

    return `${prefix}${transformed}`;
  }
}
