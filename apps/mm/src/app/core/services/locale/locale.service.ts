import { registerLocaleData } from '@angular/common';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { AvailableLangs, TranslocoService } from '@ngneat/transloco';

import { locales, MMLocales } from './locale.enum';
import { MMSeparator } from './separator.enum';

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  private separator: BehaviorSubject<MMSeparator>;
  private manualSeparator = false;

  constructor(private readonly translocoService: TranslocoService) {
    this.registerLocales();
    this.separator = new BehaviorSubject<MMSeparator>(undefined);
    const lang = this.translocoService.getActiveLang();
    this.setLocale(lang as MMLocales);
  }

  private registerLocales(): void {
    for (let l of Object.keys(locales)) {
      const locale = l as MMLocales;
      registerLocaleData(locales[locale].locale, locale);
    }
  }

  public setSeparator(separator: MMSeparator): void {
    this.separator.next(separator);
    this.manualSeparator = true;
  }

  public getSeparator(): Observable<MMSeparator> {
    return this.separator;
  }

  public setLocale(locale: MMLocales): void {
    registerLocaleData(locales[locale].locale, locale);
    this.translocoService.setActiveLang(locale);
    if (!this.manualSeparator) {
      this.separator.next(locales[locale].defaultSeparator);
    }
  }

  public getAvailableLangs(): AvailableLangs {
    return this.translocoService.getAvailableLangs();
  }

  public getActiveLang(): string {
    return this.translocoService.getActiveLang();
  }
}
