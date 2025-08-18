import { registerLocaleData } from '@angular/common';
import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';

import { locales, MMLocales } from './locale.enum';
import { MMSeparator } from './separator.enum';

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  public readonly separator = new BehaviorSubject<MMSeparator>(undefined);

  public separator$ = this.separator.asObservable();

  private manualSeparator = false;

  constructor(private readonly translocoService: TranslocoService) {
    this.registerLocales();

    const lang = this.translocoService.getActiveLang();
    this.setLocale(lang as MMLocales);
  }

  public setSeparator(separator: MMSeparator): void {
    this.separator.next(separator);
    this.manualSeparator = true;
  }

  public setLocale(locale: MMLocales): void {
    const supportedLocales = Object.keys(locales) as MMLocales[];
    const isSupported = supportedLocales.includes(locale);
    const targetLocale = isSupported ? locale : 'en';
    if (!this.manualSeparator) {
      this.separator.next(locales[targetLocale].defaultSeparator);
    }
  }

  private registerLocales(): void {
    for (const l of Object.keys(locales)) {
      const locale = l as MMLocales;
      registerLocaleData(locales[locale].locale, locale);
    }
  }
}
