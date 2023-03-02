import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { environment } from '@ea/environments/environment';
import {
  AVAILABLE_LANGUAGES,
  FALLBACK_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
} from '@ea/shared/constants/language';
import { TranslocoService } from '@ngneat/transloco';
import {
  TRANSLOCO_PERSIST_LANG_STORAGE,
  TranslocoPersistLangModule,
} from '@ngneat/transloco-persist-lang';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import deJson from '../../assets/i18n/de.json';
import enJson from '../../assets/i18n/en.json';
import { HttpEaInterceptor } from './interceptor/http-ea.interceptor';
import { StoreModule } from './store/store.module';

@NgModule({
  imports: [
    StoreModule,

    SharedTranslocoModule.forRoot(
      environment.production,
      AVAILABLE_LANGUAGES,
      undefined, // default -> undefined would lead to browser detection
      FALLBACK_LANGUAGE.id,
      LANGUAGE_STORAGE_KEY,
      true,
      !environment.localDev
    ),

    TranslocoPersistLangModule.forRoot({
      storageKey: LANGUAGE_STORAGE_KEY,
      storage: {
        provide: TRANSLOCO_PERSIST_LANG_STORAGE,
        useValue: localStorage,
      },
    }),
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpEaInterceptor,
      multi: true,
    },
  ],

  exports: [StoreModule, SharedTranslocoModule],
})
export class CoreModule {
  public constructor(private readonly translocoService: TranslocoService) {
    this.translocoService.setTranslation(enJson, 'en');
    this.translocoService.setTranslation(deJson, 'de');
  }
}
