import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';

import {
  TRANSLOCO_CONFIG,
  TRANSLOCO_SCOPE,
  TranslocoConfig,
  TranslocoModule,
  TranslocoService
} from '@ngneat/transloco';

import { sharedTranslocoLoader } from './shared-transloco.loader';

const translocoConfig: TranslocoConfig = {
  availableLangs: ['en', 'de'],
  defaultLang: 'en',
  fallbackLang: 'en',
  reRenderOnLangChange: true
};

// tslint:disable-next-line: only-arrow-functions
export function preloadLanguage(transloco: TranslocoService): any {
  const loader = () => transloco.load(translocoConfig.defaultLang).toPromise();

  return loader;
}

const preLoad = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: preloadLanguage,
  deps: [TranslocoService]
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
  exports: [TranslocoModule]
})
export class SharedTranslocoModule {
  static forRoot(
    prodMode: boolean,
    availableLangs: string[] = ['en'],
    appHasTranslations: boolean = true
  ): ModuleWithProviders {
    return {
      ngModule: SharedTranslocoModule,
      providers: [
        ...(appHasTranslations ? [sharedTranslocoLoader, preLoad] : []),
        {
          provide: TRANSLOCO_CONFIG,
          useValue: ({
            ...translocoConfig,
            prodMode,
            availableLangs,
            flatten: {
              aot: prodMode
            }
          } as unknown) as TranslocoConfig
        }
      ]
    };
  }
  static forChild(scope: string, loader: any): ModuleWithProviders {
    return {
      ngModule: SharedTranslocoModule,
      providers: [
        {
          provide: TRANSLOCO_SCOPE,
          useValue: {
            loader,
            scope
          }
        }
      ]
    };
  }
}
