import { Pipe, PipeTransform } from '@angular/core';

import { translate } from '@jsverse/transloco';

import { Duration, Keyboard } from '../../models';

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(duration: Duration): string {
    if (!duration) {
      return Keyboard.DASH;
    }

    return [
      this.buildDurationPartString('year', duration.years),
      this.buildDurationPartString('month', duration.months),
      this.buildDurationPartString('day', duration.days),
    ]
      .filter((durationPart: string) => !!durationPart)
      .join(' ');
  }

  private buildDurationPartString(
    durationPart: 'year' | 'month' | 'day',
    value: number
  ): string {
    if (value < 1) {
      return '';
    }

    const durationPartTranslation = translate(
      `shared.duration.${durationPart}${value > 1 ? 's' : ''}`
    );

    return `${value} ${durationPartTranslation}`;
  }
}
