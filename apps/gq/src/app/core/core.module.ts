import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
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
import { HttpErrorInterceptor, HttpModule } from '@schaeffler/http';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SnackBarModule } from '@schaeffler/snackbar';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../../environments/environment';
import i18nChecksumsJson from '../../i18n-checksums.json';
import { AppComponent } from '../app.component';
import { UserSettingsModule } from '../shared/components/user-settings/user-settings.module';
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
    LoadingSpinnerModule,
    MaintenanceModule,

    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      [{ id: 'en', label: 'English' }],
      'en', // default -> undefined would lead to browser detection
      'en',
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

    // HTTP
    HttpModule.forRoot({ environment }),

    // Monitoring
    ApplicationInsightsModule.forRoot(environment.applicationInsights),

    // notifications
    SnackBarModule,
  ],
  exports: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
