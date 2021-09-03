import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { TranslocoService } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from '@cdba/shared/constants';

import { Language, Locale } from '../../models';

@Component({
  selector: 'cdba-user-settings',
  templateUrl: './user-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsComponent implements OnInit {
  languageSelectControl: FormControl = new FormControl(
    this.transloco.getActiveLang()
  );
  availableLangs = this.transloco.getAvailableLangs() as Language[];

  storageKeyLocale = 'locale';
  availableLocales = AVAILABLE_LOCALES;
  currentLocaleId: string = this.storedLocale.id || this.defaultLocale.id;

  localeSelectControl: FormControl = new FormControl(this.currentLocaleId);

  constructor(
    @Inject(LOCAL_STORAGE) readonly localStorage: Storage,
    private readonly transloco: TranslocoService,
    private readonly localeService: TranslocoLocaleService
  ) {}

  public ngOnInit(): void {
    this.localeService.setLocale(this.currentLocaleId);
  }

  onLanguageSelectionChange(lang: string): void {
    this.transloco.setActiveLang(lang);

    location.reload();
  }

  onLocaleSelectionChange(locale: string): void {
    this.localeService.setLocale(locale);
    this.localStorage.setItem(this.storageKeyLocale, locale);

    location.reload();
  }

  get storedLocale(): Locale {
    return (
      this.availableLocales.find(
        (locale) =>
          locale.id === this.localStorage.getItem(this.storageKeyLocale)
      ) || this.defaultLocale
    );
  }

  get defaultLocale(): Locale {
    return (
      this.availableLocales.find(
        (locale) => locale.id === navigator?.language
      ) || DEFAULT_LOCALE
    );
  }
}
