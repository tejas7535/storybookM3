import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ReactiveComponentModule } from '@ngrx/component';

import { AzureConfig, FlowType, SharedAuthModule } from '@schaeffler/auth';
import { HeaderModule } from '@schaeffler/header';
import { IconsModule } from '@schaeffler/icons';
import { SettingsSidebarModule } from '@schaeffler/settings-sidebar';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { StoreModule } from './core/store/store.module';
import { InputModule } from './feature/input/input.module';
import { PredictionModule } from './feature/prediction/prediction.module';
import { SignedoutComponent } from './shared/components/signedout/signedout.component';
import { UnauthorizedModule } from './shared/components/unauthorized/unauthorized.module';

// tslint:disable-next-line: no-implicit-dependencies
const azureConfig = new AzureConfig(
  environment.azureTenantId,
  environment.azureClientId,
  environment.authScope,
  FlowType.CODE_FLOW,
  !environment.production
);

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule.forRoot(),
    FlexLayoutModule,
    HeaderModule,
    HttpClientModule,
    InputModule,
    MatButtonModule,
    PredictionModule,
    ReactiveComponentModule,
    SettingsSidebarModule,
    UnauthorizedModule,
    StoreModule,
    SharedTranslocoModule.forRoot(
      environment.production,
      ['de', 'en'],
      undefined,
      'en',
      true
    ),
    IconsModule,
    SharedAuthModule.forRoot(azureConfig),
  ],
  declarations: [AppComponent, SignedoutComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
