import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';

import {
  AvailableLangs,
  getBrowserLang,
  TRANSLOCO_CONFIG,
  TRANSLOCO_SCOPE,
  TranslocoConfig,
  TranslocoModule,
  TranslocoService,
} from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { TranslocoMessageFormatModule } from '@ngneat/transloco-messageformat';

import {
  DEFAULT_LANGUAGE,
  FALLBACK_LANGUAGE,
  I18N_CACHE_CHECKSUM,
  LANGUAGE_STORAGE_KEY,
} from './injection-tokens';
import { sharedTranslocoLoader } from './shared-transloco.loader';

export function preloadLanguage(
  transloco: TranslocoService,
  language: string,
  fallback: string,
  localStorageKey: string
): any {
  const storedLang = localStorage.getItem(localStorageKey);
  const lang =
    storedLang && storedLang !== 'undefined'
      ? storedLang
      : language || getBrowserLang() || fallback;

  transloco.setActiveLang(lang);
  const loader = async () => transloco.load(lang).toPromise();

  return loader;
}

export const preLoad = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: preloadLanguage,
  deps: [
    TranslocoService,
    DEFAULT_LANGUAGE,
    FALLBACK_LANGUAGE,
    LANGUAGE_STORAGE_KEY,
  ],
};

/**
 * Configures the Transloco Module for Apps.
 *
 * Use forRoot configuration only in app.module of apps.
 *
 * Use forChild configuration only in main module of libs (they need to be lazy loaded in the main app).
 *
 */
@NgModule({
  imports: [
    CommonModule,
    TranslocoModule,
    TranslocoMessageFormatModule.forRoot(),
    TranslocoLocaleModule.forRoot({
      localeConfig: {
        global: {
          date: {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          },
        },
      },
    }),
  ],
  exports: [TranslocoModule, TranslocoLocaleModule],
})
export class SharedTranslocoModule {
  public static forRoot(
    prodMode: boolean,
    availableLangs: AvailableLangs,
    defaultLang: string,
    fallbackLang: string,
    localStorageKey: string,
    appHasTranslations: boolean = true,
    enableAotFlattening: boolean,
    cacheChecksums?: { [p: string]: string }
  ): ModuleWithProviders<SharedTranslocoModule> {
    return {
      ngModule: SharedTranslocoModule,
      providers: [
        ...(appHasTranslations
          ? [
              sharedTranslocoLoader,
              { provide: DEFAULT_LANGUAGE, useValue: defaultLang },
              { provide: FALLBACK_LANGUAGE, useValue: fallbackLang },
              { provide: LANGUAGE_STORAGE_KEY, useValue: localStorageKey },
              preLoad,
            ]
          : []),
        {
          provide: TRANSLOCO_CONFIG,
          useValue: {
            prodMode,
            availableLangs,
            defaultLang,
            fallbackLang,
            missingHandler: {
              useFallbackTranslation: true,
            },
            reRenderOnLangChange: true,
            flatten: {
              aot: enableAotFlattening,
            },
          } as unknown as TranslocoConfig,
        },
        {
          provide: I18N_CACHE_CHECKSUM,
          useValue: cacheChecksums,
        },
      ],
    };
  }
  public static forChild(
    scope: string,
    loader: any
  ): ModuleWithProviders<SharedTranslocoModule> {
    return {
      ngModule: SharedTranslocoModule,
      providers: [
        {
          provide: TRANSLOCO_SCOPE,
          useValue: {
            loader,
            scope,
          },
        },
      ],
    };
  }
}
