import 'jest-preset-angular/setup-jest';

import { provideTranslocoLocale } from '@jsverse/transloco-locale';
import { provideTranslocoMessageformat } from '@jsverse/transloco-messageformat';
import { provideTranslocoPersistLang } from '@jsverse/transloco-persist-lang';
// eslint-disable-next-line no-restricted-imports
import { defineGlobalsInjections } from '@ngneat/spectator';

import { sharedTranslocoLocaleConfig } from '@schaeffler/transloco';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { getDefaultLocale } from './app/shared/constants/available-locales';
import { LANGUAGE_STORAGE_KEY } from './app/shared/constants/language';

// @ts-expect-error https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environment
globalThis.ngJest = {
  testEnvironmentOptions: {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
};

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
  ],
});
