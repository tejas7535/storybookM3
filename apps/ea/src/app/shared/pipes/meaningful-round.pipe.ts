import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

import { roundToThreeSigFigs } from '../helper/number-helper';

@Pipe({ name: 'meaningfulRound', standalone: true })
export class MeaningfulRoundPipe extends DecimalPipe implements PipeTransform {
  transform(
    value: number | string,
    digitsInfo?: string,
    locale?: string
  ): string | null;
  transform(
    value: null | undefined,
    digitsInfo?: string,
    locale?: string
  ): null;
  transform(
    value: number | string | null | undefined,
    digitsInfo?: string,
    locale?: string
  ): string | null {
    if (value === undefined || value === null) {
      // eslint-disable-next-line unicorn/no-null
      return null;
    }

    // special case for strings like "> 10000000"
    if (typeof value === 'string' && value.startsWith('> ')) {
      const numberPart = value.slice(2);
      const transformed = super.transform(numberPart, digitsInfo, locale);

      return `> ${transformed}`;
    }

    const roundedNumber = roundToThreeSigFigs(
      typeof value === 'number' ? value : Number.parseFloat(value)
    );

    // if this didn't work (e.g. value was no number after all) return original
    if (roundedNumber === 'NaN') {
      return value as string;
    }

    return super.transform(roundedNumber, digitsInfo, locale);
  }
}
