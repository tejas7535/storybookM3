import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { ApplicationInsightsModule } from '@schaeffler/application-insights';
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
import { AppRoutePath } from '../app-route-path.enum';
import { StoreModule } from './store/store.module';

const azureConfig = new AzureConfig(
  new MsalInstanceConfig(
    environment.clientId,
    environment.tenantId,
    !environment.production
  ),
  new MsalInterceptorConfig([
    new ProtectedResource(`${environment.baseUrl}/api/*`, [
      environment.appScope,
    ]),
  ]),
  new MsalGuardConfig(`/${AppRoutePath.Forbidden}`, [environment.appScope])
);

@NgModule({
  imports: [
    BrowserAnimationsModule,

    // NgRx Setup
    StoreModule,
    RouterModule,

    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      ['en'],
      'en', // default -> undefined would lead to browser detection
      'en',
      undefined, // language storage key -> language is not persisted in this app
      true,
      !environment.localDev
    ),

    // Monitoring
    ApplicationInsightsModule.forRoot(environment.applicationInsights),

    // Auth
    SharedAzureAuthModule.forRoot(azureConfig),
  ],
})
export class CoreModule {}
