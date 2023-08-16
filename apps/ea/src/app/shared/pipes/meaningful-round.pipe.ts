import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

import { roundToThreeSigFigs } from '../helper/number-helper';

const extractPrefix = (input: string): string | undefined => {
  const regex = /^(\S+\s)/;

  const match = input.match(regex);

  return match ? match[1] : undefined;
};

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

    const transformedResult = super.transform(
      roundedNumber,
      digitsInfo,
      locale
    );

    return `${prefix}${transformedResult}`;
  }
}
