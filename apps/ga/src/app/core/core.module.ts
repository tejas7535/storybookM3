import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { OneTrustModule, OneTrustService } from '@altack/ngx-onetrust';
import {
  TRANSLOCO_PERSIST_LANG_STORAGE,
  TranslocoPersistLangModule,
} from '@ngneat/transloco-persist-lang';

import { AppShellModule } from '@schaeffler/app-shell';
import {
  ApplicationInsightsModule,
  ApplicationInsightsService,
  COOKIE_GROUPS,
  CustomProps,
} from '@schaeffler/application-insights';
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

export function appInitializer(
  oneTrustService: OneTrustService,
  applicationInsightsService: ApplicationInsightsService
) {
  const customProps: CustomProps = {
    tag: 'application',
    value: '[Bearinx - Greaseapp]',
  };

  applicationInsightsService.initTracking(
    oneTrustService.consentChanged$(),
    customProps
  );

  return () => oneTrustService.loadOneTrust();
}

let Tracking = [
  ApplicationInsightsModule.forRoot(environment.applicationInsights),
  OneTrustModule.forRoot({
    cookiesGroups: COOKIE_GROUPS,
    domainScript: environment.oneTrustId,
  }),
];

let providers = [
  // OneTrust Provider must be first entry
  {
    provide: APP_INITIALIZER,
    useFactory: appInitializer,
    deps: [OneTrustService, ApplicationInsightsService],
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpGreaseInterceptor,
    multi: true,
  },
];

// needed for mobile app and medias
if (
  window.self !== window.top ||
  window.origin.includes('capacitor://') ||
  window.origin === 'http://localhost'
) {
  Tracking = [];
  providers = providers.slice(1); // Removes OneTrust Provider
}

@NgModule({
  imports: [
    CommonModule,
    StoreModule,

    // UI Modules
    AppShellModule,
    SharedModule,

    // Material Modules
    MatSidenavModule,
    MatSnackBarModule,

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
    // Monitoring
    ...Tracking,

    // HTTP
    HttpClientModule,

    // Application Insights
    ApplicationInsightsModule.forRoot(environment.applicationInsights),
  ],
  providers,
  exports: [AppShellModule, StoreModule, SharedTranslocoModule],
})
export class CoreModule {}
