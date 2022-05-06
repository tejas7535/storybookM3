import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { OneTrustModule, OneTrustService } from '@altack/ngx-onetrust';
import { ReactiveComponentModule } from '@ngrx/component';

import { AppShellModule } from '@schaeffler/app-shell';
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

import { environment } from '../../environments/environment';
import { AppComponent } from '../app.component';
import { StoreModule } from './store/store.module';

// eslint-disable-next-line import/no-extraneous-dependencies
const azureConfig = new AzureConfig(
  new MsalInstanceConfig(
    environment.azureClientId,
    environment.azureTenantId,
    !environment.production
  ),
  new MsalInterceptorConfig([
    new ProtectedResource('*/api/*', [environment.appId]),
  ]),
  new MsalGuardConfig('/login-failed', [environment.appId])
);

export function appInitializer(
  oneTrustService: OneTrustService,
  applicationInsightsService: ApplicationInsightsService
) {
  applicationInsightsService.initTracking(oneTrustService.consentChanged$());

  return () => oneTrustService.loadOneTrust();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,

    // NgRx Setup
    StoreModule,
    RouterModule,
    ReactiveComponentModule,

    // UI Modules
    MatButtonModule,
    AppShellModule,

    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      ['en'],
      'en', // default -> undefined would lead to browser detection
      'en',
      true,
      !environment.localDev
    ),

    // Auth
    SharedAzureAuthModule.forRoot(azureConfig),

    // HTTP
    HttpClientModule,

    // Monitoring
    ApplicationInsightsModule.forRoot(environment.applicationInsights),
    OneTrustModule.forRoot({
      cookiesGroups: COOKIE_GROUPS,
      domainScript: environment.oneTrustId,
    }),
  ],
  exports: [AppComponent],
  providers: [
    // OneTrust Provider must be first entry
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      deps: [OneTrustService, ApplicationInsightsService],
      multi: true,
    },
  ],
})
export class CoreModule {}
