import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AzureConfig, SharedAuthModule } from '@schaeffler/shared/auth';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';

import { environment } from '../environments/environment';

const azureConfig = new AzureConfig(
  environment.tenantId,
  environment.clientId,
  environment.appId,
  !environment.production
);

@NgModule({
  imports: [
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    SharedAuthModule.forRoot(azureConfig),
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
