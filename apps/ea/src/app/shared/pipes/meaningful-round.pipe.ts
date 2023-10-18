import { Pipe, PipeTransform } from '@angular/core';

import { TranslocoDecimalPipe } from '@ngneat/transloco-locale';

import { roundToThreeSigFigs } from '../helper/number-helper';

const extractPrefix = (input: string): string | undefined => {
  const regex = /^(\S+\s)/;

  const match = input.match(regex);

  return match ? match[1] : undefined;
};

@Pipe({ name: 'meaningfulRound', standalone: true })
export class MeaningfulRoundPipe implements PipeTransform {
  constructor(private readonly translocoDecimalPipe: TranslocoDecimalPipe) {}

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

    const transformed = this.translocoDecimalPipe.transform(roundedNumber);

    return `${prefix}${transformed}`;
  }
}
