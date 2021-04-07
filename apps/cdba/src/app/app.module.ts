import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { HttpCacheInterceptorModule } from '@ngneat/cashew';

import { AzureConfig, FlowType, SharedAuthModule } from '@schaeffler/auth';

import { CoreModule } from '@cdba/core';
import { environment } from '@cdba/environments/environment';
import { SharedModule } from '@cdba/shared';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// tslint:disable-next-line: no-implicit-dependencies
const azureConfig = new AzureConfig(
  environment.tenantId,
  environment.clientId,
  environment.appId,
  FlowType.CODE_FLOW,
  !environment.production
);

@NgModule({
  imports: [
    AppRoutingModule,
    HttpClientModule,
    HttpCacheInterceptorModule.forRoot(),
    CoreModule,
    SharedAuthModule.forRoot(azureConfig),
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
