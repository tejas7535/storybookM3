import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { MsalRedirectComponent } from '@azure/msal-angular';

import {
  AzureConfig,
  MsalGuardConfig,
  MsalInstanceConfig,
  MsalInterceptorConfig,
  ProtectedResource,
  SharedAzureAuthModule,
} from '@schaeffler/azure-auth';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

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

@NgModule({
  imports: [
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    SharedAzureAuthModule.forRoot(azureConfig),
    SharedTranslocoModule.forRoot(
      environment.production,
      ['de', 'en'],
      undefined,
      'en',
      true,
      !environment.localDev
    ),
  ],
  providers: [],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
