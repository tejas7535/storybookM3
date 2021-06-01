import { DecimalPipe } from '@angular/common';
import { OnDestroy, Pipe, PipeTransform } from '@angular/core';

import { Subscription } from 'rxjs';

import { LocaleService } from '../../core/services/locale/locale.service';
import { MMSeparator } from '../../core/services/locale/separator.enum';

@Pipe({
  name: 'mmNumber',
  pure: false,
})
export class MmNumberPipe implements PipeTransform, OnDestroy {
  private readonly subscription = new Subscription();
  private separator: MMSeparator;
  private previousParams: {
    value: string | number;
    separator: string;
    digitsInfo?: string;
    locale?: string;
  };
  private cache: string;

  constructor(
    private readonly decimalPipe: DecimalPipe,
    private readonly localeService: LocaleService
  ) {
    this.subscription.add(
      this.localeService.separator$.subscribe((separator) => {
        this.separator = separator;
      })
    );
  }

  transform(
    value: number | string,
    digitsInfo?: string,
    _locale?: string
  ): string | null {
    const overwriteLocale = this.separator === MMSeparator.Comma ? 'de' : 'en';

    const currentParams = {
      value,
      separator: this.separator,
      digitsInfo,
      locale: overwriteLocale,
    };
    if (
      !this.cache ||
      currentParams.value !== this.previousParams.value ||
      currentParams.separator !== this.previousParams.separator ||
      currentParams.digitsInfo !== this.previousParams.digitsInfo ||
      currentParams.locale !== this.previousParams.locale
    ) {
      this.previousParams = currentParams;
      const transformedVal = this.decimalPipe.transform(
        currentParams.value,
        currentParams.digitsInfo || undefined,
        currentParams.locale
      );

      this.cache = transformedVal;
    }

    return this.cache;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
