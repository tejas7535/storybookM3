import { Pipe, PipeTransform } from '@angular/core';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';

@Pipe({
  name: 'localizedOffsetDatetime',
  standalone: true,
})
export class LocalizedOffsetDatetimePipe implements PipeTransform {
  constructor(private readonly localeService: TranslocoLocaleService) {}

  transform(value: string): string {
    if (!value || value === '') {
      return undefined;
    }

    const date = new Date(value);
    const locale = this.localeService.getLocale();

    switch (locale) {
      case 'en-US': {
        return date.toLocaleString('en-US');
      }
      case 'de-DE': {
        return date.toLocaleString('de-DE');
      }
      default: {
        throw new Error(`Unsupported locale ${locale}`);
      }
    }
  }
}
