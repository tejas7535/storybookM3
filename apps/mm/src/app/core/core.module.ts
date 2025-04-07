/* eslint-disable import/no-extraneous-dependencies */
import { CommonModule, DecimalPipe } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  inject,
  LOCALE_ID,
  NgModule,
  provideAppInitializer,
} from '@angular/core';
import { RouterModule } from '@angular/router';

import { OneTrustModule, OneTrustService } from '@altack/ngx-onetrust';
import { Capacitor } from '@capacitor/core';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
import { TranslocoService } from '@jsverse/transloco';
import { provideTranslocoPersistLang } from '@jsverse/transloco-persist-lang';
import { AppDelivery } from '@mm/shared/models';
import { HttpCacheInterceptorModule } from '@ngneat/cashew';

import { AppShellModule } from '@schaeffler/app-shell';
import {
  ApplicationInsightsModule,
  ApplicationInsightsService,
  COOKIE_GROUPS,
  CustomProps,
} from '@schaeffler/application-insights';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../../environments/environment';
import { HttpLocaleInterceptor } from '../shared/interceptors/http-locale.interceptor';
import { detectAppDelivery } from './helpers/settings-helpers';
import { ConsentValues } from './services/tracking/one-trust.interface';
import { OneTrustMobileService } from './services/tracking/one-trust-mobile.service';

export class DynamicLocaleId extends String {
  public constructor(protected translocoService: TranslocoService) {
    super('');
  }

  public toString() {
    return this.translocoService.getActiveLang();
  }
}

export function mobileOneTrustInitializer(
  oneTrustMobileService: OneTrustMobileService
) {
  if (detectAppDelivery() === AppDelivery.Native) {
    FirebaseAnalytics.setCollectionEnabled({
      enabled: false,
    });

    oneTrustMobileService.initTracking();

    oneTrustMobileService.consentChanged$.subscribe((consentChange) => {
      const trackingEnabled =
        consentChange.consentStatus === ConsentValues.ConsentGiven &&
        !Capacitor.DEBUG;
      FirebaseAnalytics.setCollectionEnabled({
        enabled: trackingEnabled,
      });

      if (consentChange.consentStatus === ConsentValues.ConsentNotGiven) {
        FirebaseAnalytics.reset();
      }
    });
  }

  return () => {};
}

export function appInitializer(
  oneTrustService: OneTrustService,
  applicationInsightsService: ApplicationInsightsService
) {
  const customProps: CustomProps = {
    tag: 'application',
    value: '[Bearinx - MountingManager]',
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
  provideAppInitializer(() => {
    const initializerFn = appInitializer(
      inject(OneTrustService),
      inject(ApplicationInsightsService)
    );

    return initializerFn();
  }),
  provideAppInitializer(() => {
    const initializerFn = mobileOneTrustInitializer(
      inject(OneTrustMobileService)
    );

    return initializerFn();
  }),
  {
    provide: LOCALE_ID,
    useClass: DynamicLocaleId,
    deps: [TranslocoService],
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpLocaleInterceptor,
    multi: true,
  },
  provideTranslocoPersistLang({
    storageKey: 'language',
    storage: {
      useValue: localStorage,
    },
  }),
  DecimalPipe,
];

if (detectAppDelivery() !== AppDelivery.Standalone || environment.localDev) {
  Tracking = [];
  providers = providers.slice(1); // Removes OneTrust Provider
}

@NgModule({
  declarations: [],
  exports: [],
  imports: [
    CommonModule,
    RouterModule,
    AppShellModule,
    SharedTranslocoModule.forRoot(
      environment.production,
      [
        { id: 'de', label: 'Deutsch' },
        { id: 'en', label: 'English' },
        { id: 'es', label: 'Español' },
        { id: 'fr', label: 'Français' },
        { id: 'ru', label: 'русский' },
        { id: 'zh', label: '中文' },
      ],
      undefined, // default -> undefined would lead to browser detection
      'en',
      'language',
      true,
      !environment.localDev
    ),
    // Monitoring
    ...Tracking,
    HttpCacheInterceptorModule.forRoot(),
  ],
  providers: [provideHttpClient(withInterceptorsFromDi()), ...providers],
})
export class CoreModule {}
