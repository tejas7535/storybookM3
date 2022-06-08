import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

import { MsalRedirectComponent } from '@azure/msal-angular';
import { CoreModule } from '@cdba/core';
import { ENV, getEnv } from '@cdba/environments/environment.provider';
import {
  BetaFeatureModule,
  BrowserSupportModule,
  LoadingSpinnerModule,
  RoleDescriptionsModule,
  UserSettingsModule,
} from '@cdba/shared/components';
import { HttpCacheInterceptorModule } from '@ngneat/cashew';
import { PushModule } from '@ngrx/component';

import { AppShellModule } from '@schaeffler/app-shell';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    // angular modules
    HttpClientModule,
    HttpCacheInterceptorModule.forRoot(),
    PushModule,
    CommonModule,

    // core and routing modules
    AppRoutingModule,
    CoreModule,

    // ui and app root modules
    MatDividerModule,
    LoadingSpinnerModule,
    BetaFeatureModule,
    BrowserSupportModule,
    AppShellModule,
    UserSettingsModule,
    RoleDescriptionsModule,
  ],
  declarations: [AppComponent],
  providers: [
    {
      provide: ENV,
      useFactory: getEnv,
    },
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
