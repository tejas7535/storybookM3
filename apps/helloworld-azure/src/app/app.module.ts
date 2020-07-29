import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AzureConfig, FlowType, SharedAuthModule } from '@schaeffler/auth';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

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
    SharedAuthModule.forRoot(azureConfig),
    FlexLayoutModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
