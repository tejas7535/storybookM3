import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { OneTrustModule, OneTrustService } from '@altack/ngx-onetrust';
import {
  TRANSLOCO_PERSIST_LANG_STORAGE,
  TranslocoPersistLangModule,
} from '@ngneat/transloco-persist-lang';

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
import { StoreModule } from './store/store.module';

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
    TranslocoPersistLangModule.forRoot({
      storageKey: LANGUAGE_STORAGE_KEY,
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
  exports: [StoreModule, SharedTranslocoModule],
})
export class CoreModule {}
