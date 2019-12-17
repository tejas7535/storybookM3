import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';

import {
  getBrowserLang,
  HashMap,
  TRANSLOCO_CONFIG,
  TranslocoConfig,
  TranslocoModule,
  TranslocoService
} from '@ngneat/transloco';

import { environment } from '../../../environments/environment';
import { translocoLoader } from './transloco.loader';

const translocoConfig: TranslocoConfig = {
  availableLangs: ['en', 'de'],
  defaultLang: 'en',
  fallbackLang: 'en',
  prodMode: environment.production,
  reRenderOnLangChange: true,
  flatten: {
    aot: environment.production
  }
};

const preloadLanguage = (transloco: TranslocoService): Function => {
  return async (): Promise<HashMap> => {
    const lang = getBrowserLang();

    transloco.setActiveLang(lang);

    return transloco.load(lang).toPromise();
  };
};

const preLoad = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: preloadLanguage,
  deps: [TranslocoService]
};

@NgModule({
  imports: [TranslocoModule],
  exports: [TranslocoModule]
})
export class TranslocoConfigModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: TranslocoConfigModule,
      providers: [
        {
          provide: TRANSLOCO_CONFIG,
          useValue: translocoConfig
        },
        translocoLoader,
        preLoad
      ]
    };
  }
}
