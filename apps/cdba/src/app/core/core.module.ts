import { PlatformModule } from '@angular/cdk/platform';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import {
  TRANSLOCO_PERSIST_LANG_STORAGE,
  TranslocoPersistLangModule,
} from '@ngneat/transloco-persist-lang';
import { ReactiveComponentModule } from '@ngrx/component';

import { ApplicationInsightsModule } from '@schaeffler/application-insights';
import {
  AzureConfig,
  MsalGuardConfig,
  MsalInstanceConfig,
  MsalInterceptorConfig,
  ProtectedResource,
  SharedAzureAuthModule,
} from '@schaeffler/azure-auth';
import { HttpErrorInterceptor, HttpModule } from '@schaeffler/http';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import { environment } from '@cdba/environments/environment';
import { AVAILABLE_LANGUAGES, FALLBACK_LANGUAGE } from '@cdba/shared/constants';

import i18nChecksumsJson from '../../i18n-checksums.json';
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
  new MsalGuardConfig(`${AppRoutePath.NoAccessPath}`, [environment.appScope])
);

@NgModule({
  imports: [
    BrowserAnimationsModule,

    // NgRx Setup
    StoreModule,
    RouterModule,
    ReactiveComponentModule,

    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      AVAILABLE_LANGUAGES,
      undefined, // default -> undefined would lead to browser detection
      FALLBACK_LANGUAGE.id,
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

    // Platform required for detecting the browser engine
    PlatformModule,

    // Auth
    SharedAzureAuthModule.forRoot(azureConfig),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
