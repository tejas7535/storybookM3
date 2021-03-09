import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MsalRedirectComponent } from '@azure/msal-angular';

import {
  AzureConfig,
  MsalGuardConfig,
  MsalInstanceConfig,
  MsalInterceptorConfig,
  ProtectedResource,
  SharedAzureAuthModule,
} from '@schaeffler/azure-auth';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

const azureConfig = new AzureConfig(
  new MsalInstanceConfig(
    environment.clientId,
    environment.tenantId,
    !environment.production
  ),
  new MsalInterceptorConfig([
    new ProtectedResource('/api/*', [environment.appId]),
  ]),
  new MsalGuardConfig('/login-failed', [environment.appId])
);

@NgModule({
  imports: [
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    SharedAzureAuthModule.forRoot(azureConfig),
    FlexLayoutModule,
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
