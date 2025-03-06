import { PlatformModule } from '@angular/cdk/platform';
import { inject, NgModule, provideAppInitializer } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { OneTrustModule, OneTrustService } from '@altack/ngx-onetrust';
import { provideTranslocoPersistLang } from '@jsverse/transloco-persist-lang';
import { PushPipe } from '@ngrx/component';

import {
  ApplicationInsightsModule,
  ApplicationInsightsService,
  COOKIE_GROUPS,
} from '@schaeffler/application-insights';
import {
  AzureConfig,
  MsalGuardConfig,
  MsalInstanceConfig,
  MsalInterceptorConfig,
  ProtectedResource,
  SharedAzureAuthModule,
} from '@schaeffler/azure-auth';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import { EmptyStatesPath } from '@cdba/core/empty-states/empty-states-path.enum';
import { environment } from '@cdba/environments/environment';
import {
  AVAILABLE_LANGUAGES,
  FALLBACK_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
} from '@cdba/shared/constants';

import { HttpModule } from './http/http.module';
import { StoreModule } from './store/store.module';

const azureConfig = new AzureConfig(
  new MsalInstanceConfig(
    environment.clientId,
    environment.tenantId,
    !environment.production
  ),
  new MsalInterceptorConfig([
    new ProtectedResource('/api/*', [environment.appScope]),
  ]),
  new MsalGuardConfig(
    `${AppRoutePath.EmptyStatesPath}/${EmptyStatesPath.NoAccessPath}`,
    [environment.appScope]
  )
);

export function appInitializer(
  oneTrustService: OneTrustService,
  applicationInsightsService: ApplicationInsightsService
) {
  applicationInsightsService.initTracking(oneTrustService.consentChanged$());

  return () => oneTrustService.loadOneTrust();
}

@NgModule({
  imports: [
    BrowserAnimationsModule,

    // NgRx Setup
    StoreModule,
    RouterModule,
    PushPipe,

    // HTTP
    HttpModule,

    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      AVAILABLE_LANGUAGES,
      undefined, // default -> undefined would lead to browser detection
      FALLBACK_LANGUAGE.id,
      LANGUAGE_STORAGE_KEY,
      true,
      !environment.localDev
    ),

    // Monitoring
    ApplicationInsightsModule.forRoot(environment.applicationInsights),

    // Cookie Banner
    OneTrustModule.forRoot({
      cookiesGroups: COOKIE_GROUPS,
      domainScript: environment.oneTrustId,
    }),

    // Platform required for detecting the browser engine
    PlatformModule,

    // Auth
    SharedAzureAuthModule.forRoot(azureConfig),
  ],
  providers: [
    provideTranslocoPersistLang({
      storageKey: LANGUAGE_STORAGE_KEY,
      storage: {
        useValue: localStorage,
      },
    }),
    provideAppInitializer(() => {
      const initializerFn = appInitializer(
        inject(OneTrustService),
        inject(ApplicationInsightsService)
      );

      return initializerFn();
    }),
  ],
})
export class CoreModule {}
