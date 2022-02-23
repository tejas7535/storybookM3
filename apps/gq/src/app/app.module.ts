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

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutePath } from './app-route-path.enum';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';

const azureConfig = new AzureConfig(
  new MsalInstanceConfig(
    environment.clientId,
    environment.tenantId,
    !environment.production
  ),
  new MsalInterceptorConfig([
    new ProtectedResource('/api/*', [environment.appScope]),
  ]),
  new MsalGuardConfig(`/${AppRoutePath.ForbiddenPath}`, [environment.appScope])
);
@NgModule({
  imports: [
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    SharedAzureAuthModule.forRoot(azureConfig),
  ],
  providers: [],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
