import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import {
  TRANSLOCO_PERSIST_LANG_STORAGE,
  TranslocoPersistLangModule,
} from '@ngneat/transloco-persist-lang';
import { ReactiveComponentModule } from '@ngrx/component';

import { AppShellModule } from '@schaeffler/app-shell';
import { ApplicationInsightsModule } from '@schaeffler/application-insights';
import { MaintenanceModule } from '@schaeffler/empty-states';
import { HeaderModule } from '@schaeffler/header';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SnackBarModule } from '@schaeffler/snackbar';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../../environments/environment';
import i18nChecksumsJson from '../../i18n-checksums.json';
import { AppComponent } from '../app.component';
import { UserSettingsModule } from '../shared/components/user-settings/user-settings.module';
import {
  AVAILABLE_LANGUAGES,
  FALLBACK_LANGUAGE,
} from '../shared/constants/language';
import { BaseHttpInterceptor } from '../shared/http/base-http.interceptor';
import { StoreModule } from './store';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,

    // NgRx Setup
    StoreModule,
    RouterModule,
    ReactiveComponentModule,

    // UI Modules
    AppShellModule,
    HeaderModule,
    UserSettingsModule,
    MatButtonModule,
    MatSnackBarModule,
    LoadingSpinnerModule,
    MaintenanceModule,

    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      AVAILABLE_LANGUAGES,
      undefined, // default -> undefined would lead to browser detection
      FALLBACK_LANGUAGE.id, // fallback language
      true,
      !environment.localDev,
      i18nChecksumsJson
    ),
    TranslocoPersistLangModule.forRoot({
      storageKey: 'language',
      storage: {
        provide: TRANSLOCO_PERSIST_LANG_STORAGE,
        useValue: localStorage,
      },
    }),

    // Monitoring
    ApplicationInsightsModule.forRoot(environment.applicationInsights),

    // notifications
    SnackBarModule,
  ],
  exports: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseHttpInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
