import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { LOCAL_STORAGE } from '@ng-web-apis/common';

import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from './locale.constants';
import { Locale } from './locale.model';

@Component({
  selector: 'schaeffler-locale-select',
  templateUrl: './locale-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocaleSelectComponent implements OnInit {
  @Input() public reloadOnLocaleChange = false;
  @Input() public availableLocales: Locale[] = AVAILABLE_LOCALES;
  @Input() public defaultLocale: Locale = DEFAULT_LOCALE;
  @Input() public hintText = '';
  @Input() public tooltipText = '';

  public storageKeyLocale = 'locale';
  public currentLocaleId: string =
    this.getStoredLocale.id || this.getDefaultLocale.id;

  public localeSelectControl: UntypedFormControl = new UntypedFormControl(
    this.currentLocaleId
  );

  public constructor(
    @Inject(LOCAL_STORAGE) private readonly localStorage: Storage,
    private readonly localeService: TranslocoLocaleService
  ) {}

  protected get getStoredLocale(): Locale {
    return (
      this.availableLocales.find(
        (locale) =>
          locale.id === this.localStorage.getItem(this.storageKeyLocale)
      ) || this.getDefaultLocale
    );
  }

  protected get getDefaultLocale(): Locale {
    return (
      this.availableLocales.find(
        (locale) => locale.id === navigator?.language
      ) || this.defaultLocale
    );
  }

  public ngOnInit(): void {
    this.localeService.setLocale(this.currentLocaleId);
  }

  public onLocaleSelectionChange(locale: string): void {
    this.localeService.setLocale(locale);
    this.localStorage.setItem(this.storageKeyLocale, locale);

    if (this.reloadOnLocaleChange) {
      location.reload();
    }
  }
}
