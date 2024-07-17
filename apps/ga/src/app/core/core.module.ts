/* eslint-disable import/no-extraneous-dependencies */
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { OneTrustModule, OneTrustService } from '@altack/ngx-onetrust';
import { Capacitor } from '@capacitor/core';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
import { provideTranslocoPersistLang } from '@jsverse/transloco-persist-lang';

import {
  ApplicationInsightsModule,
  ApplicationInsightsService,
  COOKIE_GROUPS,
  CustomProps,
} from '@schaeffler/application-insights';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '@ga/environments/environment';
import {
  AVAILABLE_LANGUAGES,
  FALLBACK_LANGUAGE,
  LANGUAGE_DEUSTCH,
  LANGUAGE_STORAGE_KEY,
} from '@ga/shared/constants/language';
import { AppDelivery, PartnerVersion } from '@ga/shared/models';

import {
  detectAppDelivery,
  detectPartnerVersion,
} from './helpers/settings-helpers';
import { HttpGreaseInterceptor } from './interceptors/http-grease.interceptor';
import { ConsentValues } from './services/tracking/one-trust.interface';
import { OneTrustMobileService } from './services/tracking/one-trust-mobile.service';
import { StoreModule } from './store/store.module';

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
    provide: APP_INITIALIZER,
    useFactory: mobileOneTrustInitializer,
    deps: [OneTrustMobileService],
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpGreaseInterceptor,
    multi: true,
  },
  provideTranslocoPersistLang({
    storageKey: LANGUAGE_STORAGE_KEY,
    storage: {
      useValue: localStorage,
    },
  }),
];

// needed for mobile app and medias
if (detectAppDelivery() !== AppDelivery.Standalone || environment.localDev) {
  Tracking = [];
  providers = providers.slice(1); // Removes OneTrust Provider
}

// check for partner version languages
let availableLanguages = AVAILABLE_LANGUAGES;
let fallbackLanguageId = FALLBACK_LANGUAGE.id;
let defaultLang; // default -> undefined would lead to browser detection

if (detectPartnerVersion() === PartnerVersion.Schmeckthal) {
  availableLanguages = [LANGUAGE_DEUSTCH];
  fallbackLanguageId = LANGUAGE_DEUSTCH.id;
  defaultLang = LANGUAGE_DEUSTCH.id;
}

@NgModule({
  exports: [StoreModule, SharedTranslocoModule],
  imports: [
    StoreModule,
    // Material Modules
    MatSnackBarModule,
    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      availableLanguages,
      defaultLang, // default -> undefined would lead to browser detection
      fallbackLanguageId,
      LANGUAGE_STORAGE_KEY,
      true,
      !environment.localDev
    ),
    // Monitoring
    ...Tracking,
    // Application Insights
    ApplicationInsightsModule.forRoot(environment.applicationInsights),
  ],
  providers: [provideHttpClient(withInterceptorsFromDi()), ...providers],
})
export class CoreModule {}
