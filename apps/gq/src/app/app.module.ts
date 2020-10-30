import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AzureConfig, FlowType, SharedAuthModule } from '@schaeffler/auth';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared';

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
    CoreModule,
    SharedModule,
    SharedAuthModule.forRoot(azureConfig),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
