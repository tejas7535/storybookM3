import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MAT_LEGACY_DIALOG_DEFAULT_OPTIONS as MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/legacy-dialog';
import {
  MAT_LEGACY_SNACK_BAR_DEFAULT_OPTIONS as MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatLegacySnackBarModule as MatSnackBarModule,
} from '@angular/material/legacy-snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { OneTrustModule, OneTrustService } from '@altack/ngx-onetrust';
import { GlobalSearchBarModule } from '@gq/shared/components/global-search-bar/global-search-bar.module';
import { UserSettingsModule } from '@gq/shared/components/user-settings/user-settings.module';
import {
  AVAILABLE_LANGUAGES,
  FALLBACK_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
} from '@gq/shared/constants/language';
import { HttpErrorInterceptor } from '@gq/shared/http/http-error.interceptor';
import { HttpHeaderInterceptor } from '@gq/shared/http/http-header.interceptor';
import {
  TRANSLOCO_PERSIST_LANG_STORAGE,
  TranslocoPersistLangModule,
} from '@ngneat/transloco-persist-lang';
import { PushPipe } from '@ngrx/component';

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
    PushPipe,

    // UI Modules
    AppShellModule,
    UserSettingsModule,
    MatButtonModule,
    MatSnackBarModule,
    LoadingSpinnerModule,
    MaintenanceModule,
    GlobalSearchBarModule,

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
      useValue: { disableClose: true, hasBackdrop: true, autoFocus: true },
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
