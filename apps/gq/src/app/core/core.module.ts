import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { OneTrustModule, OneTrustService } from '@altack/ngx-onetrust';
import {
  TRANSLOCO_PERSIST_LANG_STORAGE,
  TranslocoPersistLangModule,
} from '@ngneat/transloco-persist-lang';
import { PushModule } from '@ngrx/component';

import { AppShellModule } from '@schaeffler/app-shell';
import {
  ApplicationInsightsModule,
  ApplicationInsightsService,
  COOKIE_GROUPS,
  CustomProps,
} from '@schaeffler/application-insights';
import { MaintenanceModule } from '@schaeffler/empty-states';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../../environments/environment';
import { ENV, getEnv } from '../../environments/environments.provider';
import i18nChecksumsJson from '../../i18n-checksums.json';
import { AppComponent } from '../app.component';
import { UserSettingsModule } from '../shared/components/user-settings/user-settings.module';
import {
  AVAILABLE_LANGUAGES,
  FALLBACK_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
} from '../shared/constants/language';
import { HttpErrorInterceptor } from '../shared/http/http-error.interceptor';
import { HttpHeaderInterceptor } from '../shared/http/http-header.interceptor';
import { StoreModule } from './store';

export function appInitializer(
  oneTrustService: OneTrustService,
  applicationInsightsService: ApplicationInsightsService
) {
  const customProps: CustomProps = {
    tag: 'application',
    value: '[GQ - Guided Quoting]',
  };

  applicationInsightsService.initTracking(
    oneTrustService.consentChanged$(),
    customProps
  );

  return () => oneTrustService.loadOneTrust();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,

    // NgRx Setup
    StoreModule,
    RouterModule,
    PushModule,

    // UI Modules
    AppShellModule,
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
      LANGUAGE_STORAGE_KEY, // storage key
      true,
      !environment.localDev,
      i18nChecksumsJson
    ),
    TranslocoPersistLangModule.forRoot({
      storageKey: LANGUAGE_STORAGE_KEY,
      storage: {
        provide: TRANSLOCO_PERSIST_LANG_STORAGE,
        useValue: localStorage,
      },
    }),
    // Cookie Tracking
    ApplicationInsightsModule.forRoot(environment.applicationInsights),
    OneTrustModule.forRoot({
      cookiesGroups: COOKIE_GROUPS,
      domainScript: environment.oneTrustId,
    }),

    // Monitoring
    ApplicationInsightsModule.forRoot(environment.applicationInsights),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      deps: [OneTrustService, ApplicationInsightsService],
      multi: true,
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 5000 },
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { disableClose: true, hasBackdrop: true },
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHeaderInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    {
      provide: ENV,
      useValue: { ...getEnv() },
    },
  ],
  exports: [AppComponent],
})
export class CoreModule {}
