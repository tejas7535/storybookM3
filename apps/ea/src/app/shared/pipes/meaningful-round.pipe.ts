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
    if (value === undefined || value === null || Number.isNaN(value)) {
      // eslint-disable-next-line unicorn/no-null
      return null;
    }

    const roundedNumber = roundToThreeSigFigs(
      typeof value === 'number' ? value : Number.parseFloat(value)
    );

    return super.transform(roundedNumber, digitsInfo, locale);
  }
}
