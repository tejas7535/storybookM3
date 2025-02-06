import 'jest-preset-angular/setup-jest';

import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';

import { provideTranslocoLocale } from '@jsverse/transloco-locale';
import { provideTranslocoMessageformat } from '@jsverse/transloco-messageformat';
import { provideTranslocoPersistLang } from '@jsverse/transloco-persist-lang';
// eslint-disable-next-line no-restricted-imports
import { defineGlobalsInjections } from '@ngneat/spectator';

import { sharedTranslocoLocaleConfig } from '@schaeffler/transloco';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { setupGridLicense } from './app/shared/ag-grid/grid-setup-license';
import { getDefaultLocale } from './app/shared/constants/available-locales';
import { LANGUAGE_STORAGE_KEY } from './app/shared/constants/language';

// @ts-expect-error https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environment
globalThis.ngJest = {
  testEnvironmentOptions: {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
};

setupGridLicense();

defineGlobalsInjections({
  imports: [
    provideTranslocoTestingModule(
      { en: {}, de: {} },
      {
        translocoConfig: {
          availableLangs: ['de', 'en'],
          defaultLang: 'de',
        },
        preloadLangs: false,
      }
    ),
  ],
  providers: [
    // Transloco
    provideTranslocoLocale({
      ...sharedTranslocoLocaleConfig,
      defaultLocale: getDefaultLocale().id,
    }),
    provideTranslocoPersistLang({
      storageKey: LANGUAGE_STORAGE_KEY,
      storage: {
        useValue: localStorage,
      },
    }),
    provideTranslocoMessageformat(),

    // Date
    { provide: MAT_DATE_LOCALE, useValue: 'en' },
    provideDateFnsAdapter(),
    {
      provide: MAT_DATE_FORMATS,
      useFactory: () => ({
        parse: { dateInput: 'dd.MM.yyyy' },
        display: {
          dateInput: 'dd.MM.yyyy',
          monthYearLabel: 'MMMM yyyy',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM yyyy',
        },
      }),
      deps: [DateAdapter],
    },
  ],
});
