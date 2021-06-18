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

import {
  DEFAULT_LANGUAGE,
  FALLBACK_LANGUAGE,
  I18N_CACHE_CHECKSUM,
} from './injection-tokens';
import { sharedTranslocoLoader } from './shared-transloco.loader';

export function preloadLanguage(
  transloco: TranslocoService,
  language: string,
  fallback: string
): any {
  const lang = language || getBrowserLang() || fallback;

  transloco.setActiveLang(lang);
  const loader = () => transloco.load(lang).toPromise();

  return loader;
}

export const preLoad = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: preloadLanguage,
  deps: [TranslocoService, DEFAULT_LANGUAGE, FALLBACK_LANGUAGE],
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
  imports: [CommonModule, TranslocoModule],
  exports: [TranslocoModule],
})
export class SharedTranslocoModule {
  public static forRoot(
    prodMode: boolean,
    availableLangs: AvailableLangs,
    defaultLang: string,
    fallbackLang: string,
    appHasTranslations: boolean = true,
    cacheChecksums?: { [key: string]: string }
  ): ModuleWithProviders<SharedTranslocoModule> {
    return {
      ngModule: SharedTranslocoModule,
      providers: [
        ...(appHasTranslations
          ? [
              sharedTranslocoLoader,
              { provide: DEFAULT_LANGUAGE, useValue: defaultLang },
              { provide: FALLBACK_LANGUAGE, useValue: fallbackLang },
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
            reRenderOnLangChange: true,
            flatten: {
              aot: prodMode,
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
