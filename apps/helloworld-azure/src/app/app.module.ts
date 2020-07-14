import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FooterModule } from '@schaeffler/footer';
import { HeaderModule } from '@schaeffler/header';
import {
  AzureConfig,
  FlowType,
  SharedAuthModule,
} from '@schaeffler/shared/auth';

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
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    HeaderModule,
    FooterModule,
    FlexLayoutModule,
    AppRoutingModule,
    CoreModule,
    SharedAuthModule.forRoot(azureConfig),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
