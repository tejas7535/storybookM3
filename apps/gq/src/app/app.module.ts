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
import { AppRoutePath } from './app-route-path.enum';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared';
import { RoleModalModule } from './shared/role-modal/role-modal.module';

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
    RoleModalModule,
    CoreModule,
    SharedModule,
    SharedAzureAuthModule.forRoot(azureConfig),
  ],
  providers: [],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
