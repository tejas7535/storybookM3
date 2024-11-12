import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { TranslocoDirective } from '@jsverse/transloco';

import {
  LanguageSelectModule,
  Locale,
  LocaleSelectModule,
} from '@schaeffler/transloco/components';

import {
  AVAILABLE_LOCALES,
  DEFAULT_LOCALE,
} from '../../constants/available-locales';

@Component({
  selector: 'd360-user-settings',
  standalone: true,
  imports: [
    CommonModule,
    LanguageSelectModule,
    LocaleSelectModule,
    TranslocoDirective,
  ],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss',
})
export class UserSettingsComponent {
  availableLocales: Locale[] = AVAILABLE_LOCALES;
  defaultLocale: Locale = DEFAULT_LOCALE;
}
