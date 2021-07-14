import { registerLocaleData } from '@angular/common';
import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { AvailableLangs, TranslocoService } from '@ngneat/transloco';

import { locales, MMLocales } from './locale.enum';
import { MMSeparator } from './separator.enum';

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  private readonly separator = new BehaviorSubject<MMSeparator>(undefined);
  private readonly language = new BehaviorSubject<MMLocales>(undefined);

  separator$ = this.separator.asObservable();
  language$ = this.language.asObservable();

  private manualSeparator = false;

  constructor(private readonly translocoService: TranslocoService) {
    this.registerLocales();

    const lang = this.translocoService.getActiveLang();
    this.setLocale(lang as MMLocales);
  }

  private registerLocales(): void {
    for (const l of Object.keys(locales)) {
      const locale = l as MMLocales;
      registerLocaleData(locales[locale].locale, locale);
    }
  }

  public setSeparator(separator: MMSeparator): void {
    this.separator.next(separator);
    this.manualSeparator = true;
  }

  public setLocale(locale: MMLocales): void {
    this.language.next(locale);
    this.translocoService.setActiveLang(locale);
    if (!this.manualSeparator) {
      this.separator.next(locales[locale].defaultSeparator);
    }
  }

  public getAvailableLangs(): AvailableLangs {
    return this.translocoService.getAvailableLangs();
  }
}
