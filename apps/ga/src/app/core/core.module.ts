import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';

import {
  TRANSLOCO_PERSIST_LANG_STORAGE,
  TranslocoPersistLangModule,
} from '@ngneat/transloco-persist-lang';

import { AppShellModule } from '@schaeffler/app-shell';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../../environments/environment';
import { HttpGreaseInterceptor } from '../shared/interceptors/http-grease.interceptor';
import { SharedModule } from '../shared/shared.module';
import { StoreModule } from './store/store.module';

export const availableLanguages: { id: string; label: string }[] = [
  { id: 'de', label: 'Deutsch' },
  { id: 'en', label: 'English' },
  // { id: 'es', label: 'Español' },
  // { id: 'fr', label: 'Français' },
  // { id: 'ru', label: 'русский' },
  // { id: 'zh', label: '中国' },
];

@NgModule({
  imports: [
    CommonModule,
    StoreModule,

    // UI Modules
    AppShellModule,
    SharedModule,

    // Material Modules
    MatSidenavModule,

    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      availableLanguages,
      undefined, // default -> undefined would lead to browser detection
      'en',
      true,
      !environment.localDev
    ),
    TranslocoPersistLangModule.forRoot({
      storageKey: 'language',
      storage: {
        provide: TRANSLOCO_PERSIST_LANG_STORAGE,
        useValue: localStorage,
      },
    }),

    // HTTP
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpGreaseInterceptor,
      multi: true,
    },
  ],
  exports: [AppShellModule, StoreModule, SharedTranslocoModule],
})
export class CoreModule {}
